# DigitalOcean Spaces Integration Design (S3-Compatible) — Media Platform Backend

## 1) Overview
This design explains how the backend integrates with **DigitalOcean Spaces** using the **S3-compatible API** for uploads, retrieval, and streaming delivery.

Primary goals:
- Offload large file transfer from backend to object storage.
- Keep backend as control-plane (auth, policy, metadata, presigned URLs).
- Use CDN delivery for low-latency global playback.

---

## 2) Create API Keys (Spaces Access Credentials)

## 2.1 Create a Spaces Access Key Pair
1. In DigitalOcean dashboard, open **API** settings.
2. Create a **Spaces access key** (Access Key + Secret Key).
3. Restrict key usage by environment (dev/staging/prod) and store separately.
4. Rotate keys periodically and on suspected compromise.

## 2.2 Key Management Best Practices
- Never hardcode keys in source code.
- Store credentials in secrets manager or environment variables.
- Use separate keys per service/environment for blast-radius isolation.
- Log key usage patterns and alert on anomalies.

## 2.3 Required Backend Secrets
- `SPACES_ACCESS_KEY_ID`
- `SPACES_SECRET_ACCESS_KEY`
- `SPACES_REGION` (e.g., `nyc3`)
- `SPACES_BUCKET`
- `SPACES_ENDPOINT` (e.g., `https://nyc3.digitaloceanspaces.com`)
- `SPACES_CDN_BASE_URL` (if CDN enabled, e.g., `https://cdn.example.com`)

---

## 3) Configure Spaces Endpoint (S3-Compatible)

## 3.1 Endpoint and Region
DigitalOcean Spaces supports S3-compatible calls against region endpoints, such as:
- `https://nyc3.digitaloceanspaces.com`
- `https://sgp1.digitaloceanspaces.com`

Backend object client must be configured with:
- S3-compatible signature support (SigV4)
- Region and endpoint override
- Path/key naming strategy that matches media domain model

## 3.2 Bucket Setup
- Create one bucket per environment or per trust boundary.
- Recommended: `media-prod`, `media-staging`, `media-dev`.
- Enable versioning if rollback/recovery is needed.
- Configure CORS to allow trusted frontend origins for direct browser uploads.

## 3.3 CORS Rules (Direct Upload Support)
Allow:
- Methods: `PUT`, `GET`, `HEAD`
- Headers: `Content-Type`, `Content-MD5`, auth-related signed headers
- Origins: your frontend domains only
- Exposed headers: `ETag`

---

## 4) Generate Presigned Upload URLs

## 4.1 Backend Flow
1. Client sends upload intent (`filename`, `mimeType`, `size`, `mediaType`).
2. Backend authenticates user and validates policy (type, size, quota).
3. Backend generates object key and signs a short-lived PUT URL.
4. Backend returns `uploadUrl`, required headers, `objectKey`, expiry, `mediaId`.
5. Client uploads file directly to Spaces using URL.
6. Backend verifies completion and marks media metadata as `ready`.

## 4.2 Signing Rules
- Expiration: short TTL (typically 5–15 minutes).
- Restrict to single method (`PUT`).
- Bind expected `Content-Type`.
- Optionally bind `Content-MD5`/checksum for integrity checks.

## 4.3 Large File Strategy
- Small files: single PUT presigned upload.
- Large files: multipart presigned upload with part-size policy.
- Very large video: resumable/multipart strategy with server-side finalization.

---

## 5) Media Folder Structure in Spaces

Required top-level structure:
- `/videos`
- `/images`
- `/documents`
- `/thumbnails`

Recommended production key structure:

```text
/videos/{userId}/{yyyy}/{mm}/{mediaId}/{variant}
/images/{userId}/{yyyy}/{mm}/{mediaId}.{ext}
/documents/{userId}/{yyyy}/{mm}/{mediaId}.{ext}
/thumbnails/{userId}/{yyyy}/{mm}/{mediaId}_{size}.jpg
```

Optional processed/transcoded layout:

```text
/videos/{userId}/{yyyy}/{mm}/{mediaId}/source.mp4
/videos/{userId}/{yyyy}/{mm}/{mediaId}/hls/master.m3u8
/videos/{userId}/{yyyy}/{mm}/{mediaId}/hls/720p/segment_0001.ts
/videos/{userId}/{yyyy}/{mm}/{mediaId}/hls/480p/segment_0001.ts
```

Benefits:
- Predictable retrieval paths.
- Easy lifecycle cleanup by prefix.
- Better operations observability and cost attribution by prefix/user/date.

---

## 6) Upload Process (End-to-End)

1. **Initiate**: frontend requests upload contract from backend.
2. **Authorize**: backend checks auth, quota, mime, and max size.
3. **Presign**: backend signs PUT (or multipart part URLs).
4. **Transfer**: frontend uploads directly to Spaces.
5. **Finalize**: frontend notifies backend or worker verifies object via `HEAD`.
6. **Persist**: backend stores metadata (`object_key`, size, checksum, type).
7. **Publish**: media can now be attached to a post and served in feed.

Failure handling:
- Upload failure: retry with same contract if valid; otherwise re-initiate.
- Expired URL: request new presigned URL.
- Partial multipart upload: abort incomplete multipart session via backend policy.

---

## 7) File Naming Strategy

## 7.1 Naming Principles
- Never trust client filename for storage key identity.
- Use server-generated identifiers (UUID/ULID).
- Keep extension only for debugging and compatibility hints.

## 7.2 Recommended Key Format
`{category}/{userId}/{date}/{mediaId}_{hash}.{ext}`

Where:
- `category` = videos/images/documents/thumbnails
- `mediaId` = DB identifier (UUID)
- `hash` = short checksum or random suffix (collision safety)

## 7.3 Why This Works
- Prevents collisions and path traversal abuse.
- Makes ownership and audit tracing straightforward.
- Supports immutable asset versioning (new upload => new key).

---

## 8) Security Rules

## 8.1 Upload Security
- Validate MIME type + extension + size before presign.
- Enforce per-user rate limits and daily quota.
- Use short-lived presigned URLs only.
- Restrict signed operation to exact object key and method.

## 8.2 Data Access Security
- Default posture: private bucket objects unless explicitly public.
- Enforce authorization before returning signed download/stream URLs.
- Use least-privilege access key scope for backend services.

## 8.3 Content Safety
- Malware scanning for document uploads.
- Optional image/video moderation pipeline before publish.
- Mark flagged files with metadata state (`quarantined`, `blocked`).

## 8.4 Operational Security
- Rotate keys periodically.
- Enable audit logging for upload/retrieval operations.
- Alert on abnormal upload spikes or suspicious access patterns.

---

## 9) Public vs Private Files

## 9.1 Public Files
Typical for:
- Public post thumbnails
- Publicly visible images/videos/doc previews

Delivery:
- Return stable CDN URL.
- Cache aggressively with long `Cache-Control` + immutable keys.

## 9.2 Private Files
Typical for:
- Followers-only/private post media
- Sensitive documents
- Original source files not intended for broad distribution

Delivery:
- Return short-lived presigned GET URL from backend after auth check.
- Disable broad caching for signed/private responses.

## 9.3 Hybrid Pattern
- Public derived assets (thumbnails, lower-res variants).
- Private originals protected behind signed URLs.

This balances performance and access control.

---

## 10) Streaming Optimization

## 10.1 Video Format Strategy
- Store source file in `/videos/.../source.mp4`.
- Produce HLS renditions (`master.m3u8` + segmented variants).
- Serve adaptive bitrate profiles (1080p/720p/480p).

## 10.2 Playback Behavior
- Player requests HLS manifest.
- Client fetches small segments incrementally.
- Network-aware quality switching improves stability.

## 10.3 Storage/Delivery Optimizations
- Keep segment size balanced for startup vs overhead (e.g., 2–6s segments).
- Generate and store poster/thumbnail for fast feed previews.
- Use Range request compatibility for MP4 fallback playback.

---

## 11) CDN for Faster Streaming

## 11.1 Why CDN Helps
CDN moves content closer to users via edge caching, reducing:
- Startup latency
- Buffering events
- Origin load on Spaces

## 11.2 CDN Integration Model
1. Attach CDN endpoint/custom domain to Spaces bucket.
2. Backend returns CDN URLs for public media and HLS assets.
3. Edge caches hot manifests/segments/images/doc previews.
4. Misses fall back to Spaces origin automatically.

## 11.3 Cache Strategy
- Manifests: shorter TTL (can change with encoding updates).
- Segments/thumbnails: long TTL + immutable key versioning.
- Invalidate only when necessary; prefer versioned keys over purge-heavy workflows.

## 11.4 Private Streaming with CDN
Options:
- Signed origin URLs (backend presigned links), or
- Tokenized CDN access layer (if supported by chosen edge setup).

Recommended baseline:
- Public videos via CDN URLs.
- Private videos via short-lived signed URLs, optionally fronted by restricted CDN strategy.

---

## 12) Integration Checklist

- [ ] Create and store Spaces API keys securely.
- [ ] Provision bucket(s) and configure CORS.
- [ ] Implement backend presign endpoint logic.
- [ ] Enforce upload policies (type, size, quota, rate limit).
- [ ] Persist metadata for each upload and finalize object readiness.
- [ ] Define key prefixes: `/videos`, `/images`, `/documents`, `/thumbnails`.
- [ ] Configure CDN endpoint/domain for public delivery.
- [ ] Implement public vs private retrieval policy.
- [ ] Add monitoring, logging, alerting, and key rotation procedures.

This architecture gives a secure, scalable Spaces integration with efficient direct uploads and CDN-accelerated streaming delivery.
