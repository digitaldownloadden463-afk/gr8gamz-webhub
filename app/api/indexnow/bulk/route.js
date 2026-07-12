import {
  authoriseSubmission,
  clampBulkLimit,
  jsonResponse,
  normaliseScope,
  prepareBulkUrls,
  readJsonObject,
  safePayloadPreview,
  submitIndexNow
} from '../indexnow.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const scope = normaliseScope(searchParams.get('scope'));
  if (!scope) return jsonResponse({ ok: false, error: 'Unknown IndexNow scope.' }, 400);

  const limit = clampBulkLimit(searchParams.get('limit'));
  const requestedUrls = searchParams.getAll('url');
  const prepared = prepareBulkUrls({
    scope,
    limit,
    requestedUrls: requestedUrls.length ? requestedUrls : undefined
  });
  if (!prepared.ok) return prepared.response;

  return jsonResponse({
    ok: true,
    mode: 'dry-run',
    dryRun: true,
    mutating: false,
    scope,
    count: prepared.urls.length,
    payload: safePayloadPreview(prepared.urls)
  });
}

export async function POST(request) {
  const authorisation = authoriseSubmission(request);
  if (!authorisation.ok) return authorisation.response;

  const parsed = await readJsonObject(request);
  if (!parsed.ok) return parsed.response;

  const scope = normaliseScope(parsed.value.scope);
  if (!scope) return jsonResponse({ ok: false, error: 'Unknown IndexNow scope.' }, 400);

  const limit = clampBulkLimit(parsed.value.limit);
  const prepared = prepareBulkUrls({ scope, limit, requestedUrls: parsed.value.urls });
  if (!prepared.ok) return prepared.response;

  return submitIndexNow(prepared.urls);
}
