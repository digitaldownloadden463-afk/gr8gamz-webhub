import {
  authoriseSubmission,
  jsonResponse,
  normaliseSameSiteUrl,
  readJsonObject,
  safePayloadPreview,
  statusPayload,
  submitIndexNow
} from './indexnow.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const requestedUrl = searchParams.get('url');
  if (!requestedUrl) return jsonResponse(statusPayload());

  const url = normaliseSameSiteUrl(requestedUrl);
  if (!url) {
    return jsonResponse({ ok: false, error: 'url must use the configured site origin.' }, 400);
  }

  return jsonResponse({
    ok: true,
    mode: 'dry-run',
    dryRun: true,
    mutating: false,
    payload: safePayloadPreview([url])
  });
}

export async function POST(request) {
  const authorisation = authoriseSubmission(request);
  if (!authorisation.ok) return authorisation.response;

  const parsed = await readJsonObject(request);
  if (!parsed.ok) return parsed.response;

  const url = normaliseSameSiteUrl(parsed.value.url);
  if (!url) {
    return jsonResponse({ ok: false, error: 'url must use the configured site origin.' }, 400);
  }

  return submitIndexNow([url]);
}
