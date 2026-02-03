import { Report } from './types';
import { getRedisClient } from './redis';
import { compressData, decompressData, isCompressed } from './compression';

const REPORT_TTL = 172800; // 2 days in seconds

function getReportKey(id: string): string {
  return `report:${id}`;
}

export async function getReport(id: string): Promise<Report | undefined> {
  try {
    const redis = getRedisClient();
    const data = await redis.get(getReportKey(id));
    if (data) {
      // Backwards compatibility: detect plain JSON vs compressed data
      if (isCompressed(data)) {
        return decompressData<Report>(data);
      }
      // Legacy format: plain JSON
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading report from Redis:', error);
  }
  return undefined;
}

export async function setReport(id: string, report: Report): Promise<void> {
  try {
    const redis = getRedisClient();
    const compressed = compressData(report);
    await redis.setex(getReportKey(id), REPORT_TTL, compressed);
  } catch (error) {
    console.error('Error writing report to Redis:', error);
  }
}
