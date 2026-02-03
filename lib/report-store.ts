import { Report } from './types';
import { getRedisClient } from './redis';

const REPORT_TTL = 3600; // 1 hour in seconds

function getReportKey(id: string): string {
  return `report:${id}`;
}

export async function getReport(id: string): Promise<Report | undefined> {
  try {
    const redis = getRedisClient();
    const data = await redis.get(getReportKey(id));
    if (data) {
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
    await redis.setex(getReportKey(id), REPORT_TTL, JSON.stringify(report));
  } catch (error) {
    console.error('Error writing report to Redis:', error);
  }
}

export async function updateReportProgress(
  id: string,
  progress: Partial<Report['progress']>
): Promise<void> {
  const report = await getReport(id);
  if (report) {
    report.progress = { ...report.progress, ...progress } as Report['progress'];
    await setReport(id, report);
  }
}
