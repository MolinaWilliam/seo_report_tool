import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { validateDomain, cleanDomain } from '@/lib/utils';
import { createSeRankingClient } from '@/lib/seranking';
import { generateReport, setReport } from '@/lib/report-generator';
import { generateMockReport } from '@/lib/mock-data';
import type { Report } from '@/lib/types';

export const maxDuration = 300; // 5 minutes max for report generation

// SSE helper to format events
function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, apiKey } = body;

    // Validate domain
    const cleanedDomain = cleanDomain(domain || '');
    if (!cleanedDomain || !validateDomain(cleanedDomain)) {
      return new Response(
        JSON.stringify({ error: 'Invalid domain. Please enter a valid domain (e.g., example.com)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate API key
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Please provide your SE Ranking API key' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create report ID
    const reportId = uuidv4();

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // Helper to send SSE events
        const sendEvent = (event: string, data: unknown) => {
          controller.enqueue(encoder.encode(sseEvent(event, data)));
        };

        try {
          // Send initial event
          sendEvent('progress', {
            status: 'processing',
            progress: 0,
            currentStep: 'Initializing...',
            step: 0,
            totalSteps: 21,
          });

          const client = createSeRankingClient(apiKey, true);
          let reportData;

          if (client) {
            // Use real API with progress callback
            reportData = await generateReport(client, cleanedDomain, {
              onProgress: (step: string, progress: number) => {
                sendEvent('progress', {
                  status: 'processing',
                  progress,
                  currentStep: step,
                });
              },
            });
          } else {
            // Use mock data with simulated progress
            const steps = [
              { step: 'Fetching backlink data...', progress: 20 },
              { step: 'Analyzing keywords...', progress: 40 },
              { step: 'Running site audit...', progress: 60 },
              { step: 'Checking AI visibility...', progress: 80 },
              { step: 'Compiling report...', progress: 95 },
            ];

            for (const { step, progress } of steps) {
              sendEvent('progress', {
                status: 'processing',
                progress,
                currentStep: step,
              });
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            reportData = generateMockReport(cleanedDomain);
          }

          // Build final report object
          const report: Report = {
            id: reportId,
            domain: cleanedDomain,
            createdAt: new Date().toISOString(),
            status: 'completed',
            data: reportData,
          };

          // Store final report in Redis (single command)
          await setReport(reportId, report);

          // Send completion event
          sendEvent('complete', {
            id: reportId,
            status: 'completed',
          });
        } catch (error) {
          console.error('Report generation error:', error);
          sendEvent('error', {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
