import { NextRequest, NextResponse } from 'next/server';
import { SeRankingClient } from '@/lib/seranking';
import { getReport } from '@/lib/report-generator';

// POST: Start async export or get sample backlinks
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { apiKey, action, limit = 100, perDomain = 2, taskId } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Get the report to find the domain
    const report = getReport(id);
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const domain = report.domain;
    const client = new SeRankingClient(apiKey);

    // Action: Get sample backlinks using /raw with per_domain filter
    if (action === 'sample') {
      const result = await client.getBacklinksRaw(domain, {
        limit,
        perDomain,
        orderBy: 'domain_inlink_rank',
      });

      return NextResponse.json({
        domain,
        totalBacklinks: report.data?.backlinks?.summary?.backlinks || 0,
        exported: result.backlinks.length,
        perDomain,
        creditsUsed: result.backlinks.length,
        backlinks: result.backlinks,
      });
    }

    // Action: Start async full export
    if (action === 'start-export') {
      const result = await client.exportBacklinks(domain, 'domain');

      return NextResponse.json({
        taskId: result.taskId,
        status: result.status,
        domain,
        totalBacklinks: report.data?.backlinks?.summary?.backlinks || 0,
        estimatedCredits: report.data?.backlinks?.summary?.backlinks || 0,
      });
    }

    // Action: Check export status
    if (action === 'check-status' && taskId) {
      const result = await client.getBacklinksExportStatus(taskId);

      return NextResponse.json({
        taskId,
        status: result.status,
        downloadUrl: result.downloadUrl,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: sample, start-export, or check-status' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Export backlinks error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Export failed' },
      { status: 500 }
    );
  }
}
