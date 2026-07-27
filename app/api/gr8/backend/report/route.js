import { cleanText, jsonResponse, listRecords, readJson, requestMeta, writeRecord } from '../../../../../lib/server/gr8BackendStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return jsonResponse(listRecords('reports', 50));
}

export async function POST(request) {
  const body = await readJson(request);
  if (!body.message) {
    return jsonResponse({ ok: false, error: 'Missing report message' }, { status: 400 });
  }
  const record = {
    reason: cleanText(body.reason || 'Other site feedback', 120),
    page: cleanText(body.page || '', 200),
    playerId: cleanText(body.playerId || '', 120),
    message: cleanText(body.message, 1200),
    status: 'queued'
  };
  return jsonResponse(await writeRecord('reports', record, requestMeta(request)));
}
