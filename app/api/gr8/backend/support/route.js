import { cleanText, jsonResponse, listRecords, readJson, requestMeta, writeRecord } from '../../../../../lib/server/gr8BackendStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return jsonResponse(listRecords('support', 50));
}

export async function POST(request) {
  const body = await readJson(request);
  if (!body.subject || !body.message) {
    return jsonResponse({ ok: false, error: 'Missing subject or message' }, { status: 400 });
  }
  const record = {
    type: cleanText(body.type || 'General support', 80),
    name: cleanText(body.name || '', 80),
    email: cleanText(body.email || '', 180),
    subject: cleanText(body.subject, 140),
    message: cleanText(body.message, 1400),
    status: 'queued'
  };
  return jsonResponse(await writeRecord('support', record, requestMeta(request)));
}
