# Media Sharing Platform — Product Feature Design

## 1) User Features

### 1.1 Account Creation
- **Registration methods**
  - Email + password sign-up.
  - Optional social sign-in (Google/GitHub) as a future enhancement.
- **Core fields**
  - Required: username, email, password.
  - Optional at sign-up: display name, avatar.
- **Validation rules**
  - Username: unique, 3–30 chars, alphanumeric + underscore.
  - Email: unique + verified before full posting permissions.
  - Password: minimum 8 chars, complexity requirements.
- **Security controls**
  - Email verification token with expiry.
  - CAPTCHA/rate-limit on repeated sign-up attempts.
  - Device/session fingerprint logging for risk detection.
- **Onboarding**
  - First-login profile completion prompts.
  - Content preference selection used to seed first feed.

### 1.2 Login
- **Authentication methods**
  - Email + password.
  - Optional OAuth providers.
- **Session model**
  - Short-lived access token + refresh token rotation.
  - Active session list in account settings (device, location, last seen).
- **Account safety**
  - Brute-force protection (temporary lockouts after repeated failures).
  - Optional 2FA (TOTP) for sensitive accounts.
  - “Forgot password” with signed reset links.

### 1.3 Profile
- **Public profile elements**
  - Avatar, cover image, display name, username, bio.
  - Post count, media count, joined date.
- **Editable settings**
  - Profile media, bio, website, location.
  - Privacy level (public / followers-only / private account).
  - Notification preferences.
- **Profile tabs**
  - Posts (all content types).
  - Media-only view (images/videos).
  - Documents shared.
- **Moderation hooks**
  - Report profile.
  - Block/mute users.

### 1.4 Feed
- **Feed types**
  - Home timeline (algorithmic + recency blend).
  - Following timeline (strictly followed accounts, chronological).
  - User profile feeds (author-scoped).
- **Ranking signals**
  - Recency, creator affinity, media engagement history, content type preference.
- **User controls**
  - Filter by media type (text/image/video/document).
  - Mute topics/users.
  - Hide or report post directly from feed card.

---

## 2) Post System

### 2.1 Supported Post Types
- **Text post**
  - Body text, hashtags, mentions, optional links.
- **Image post**
  - Single or multi-image carousel.
  - Optional caption and alt text.
- **Video post**
  - Upload video + auto-generated thumbnail.
  - Optional caption and chapter/timestamp metadata (future).
- **Document post**
  - PDF/doc/xlsx/ppt/txt and similar allowed formats.
  - Optional description and downloadable attachment card.

### 2.2 Post Composition Flow
1. User opens composer and selects content type.
2. Client requests upload intent from API (file metadata, type, size).
3. API validates policy, returns presigned upload URL(s).
4. Client uploads directly to Spaces.
5. Client submits final post payload referencing uploaded object key(s).
6. Feed renders post in pending/processing state if needed.

### 2.3 Post State Lifecycle
- `draft` → `uploading` → `processing` (for video/doc preview) → `published`.
- Failure states:
  - `upload_failed` (retry upload)
  - `processing_failed` (reprocess request)
  - `blocked` (policy/moderation violation)

---

## 3) Media Handling Features

### 3.1 Upload Media
- Direct-to-Spaces upload for reduced backend bandwidth.
- Multipart upload for large files.
- Upload progress, retry, and resumable behavior.
- Server-side media validation by MIME + extension + size.
- Virus scanning hook for documents before publish.

### 3.2 Preview Media
- **Image**: responsive thumbnails + full-size modal preview.
- **Video**: poster thumbnail + inline player.
- **Document**: document card with metadata and optional first-page preview.

### 3.3 Streaming Video
- Streams from DigitalOcean Spaces object URLs or CDN URLs.
- Supports HTTP Range requests for seek/playback continuity.
- Adaptive bitrate (if HLS renditions available) with manifest delivery.

### 3.4 Download Documents
- Download button on post/document page.
- Access governed by post visibility policy.
- Optional signed download URL for private/restricted files.

---

## 4) Feed Behavior

### 4.1 Timeline Feed
- Cursor-based pagination (not offset-based) for stable scrolling.
- Mixed media cards normalized to a common post schema.
- Deduplication across refreshes and background updates.

### 4.2 Media Preview Behavior
- Image and video thumbnails load first; full content deferred.
- Video does not autoplay by default on low bandwidth.
- Document previews show icon + first-page snapshot where available.

### 4.3 Lazy Loading
- Infinite scroll with intersection observers.
- Prefetch next page when user reaches threshold.
- Delay loading heavy assets (full-res images/video segments) until in-viewport.

---

## 5) Upload Limits

### 5.1 Per-file Limits
- Text-only post: up to **10,000 characters**.
- Image: up to **20 MB per file**, max **10 images/post**.
- Video: up to **2 GB per file** (MVP) and configurable per plan.
- Document: up to **100 MB per file**.

### 5.2 Throughput and Quotas
- Per-user daily upload quota (e.g., 5 GB/day default).
- Burst upload rate limits to prevent abuse.
- Tenant-level limits (if multi-tenant version introduced).

### 5.3 Type and Security Restrictions
- Allowed MIME whitelist by category.
- Block executable/script formats for document uploads.
- Filename normalization + server-generated object keys.

---

## 6) Streaming Behavior (DigitalOcean Spaces)

### 6.1 Presigned URL Streaming (Private Media)
- **When used**: private accounts, followers-only posts, expiring access needs.
- **Flow**:
  1. Client requests playback URL for media ID.
  2. API checks auth + authorization (viewer can access post).
  3. API generates short-lived presigned URL (e.g., 1–5 minutes).
  4. Player streams video directly from Spaces with Range requests.
  5. Client refreshes tokenized URL before expiry for long sessions.
- **Pros**
  - Fine-grained access control.
  - Time-limited links reduce leakage impact.
- **Trade-offs**
  - Extra API hop and URL refresh logic.
  - Less CDN cache efficiency if URLs are highly unique.

### 6.2 Public CDN URL Streaming (Public Media)
- **When used**: publicly visible posts optimized for scale.
- **Flow**:
  1. API returns canonical CDN path for video/manifest.
  2. Player fetches content from CDN edge nearest user.
  3. Cache hits reduce origin (Spaces) load and playback latency.
- **Pros**
  - Best performance and global delivery.
  - Excellent cacheability for hot media.
- **Trade-offs**
  - Not suitable for private assets without extra token gating.

### 6.3 Strategy Recommendation
- Use **presigned URLs** for private or restricted content.
- Use **public CDN URLs** for globally visible content.
- Hybrid: signed manifest URL + cached segment URLs where policy allows.

---

## 7) Content Rendering Logic

### 7.1 Post Card Renderer Rules
- Render by `post.type`:
  - `text`: text component + link unfurl.
  - `image`: grid/carousel component + zoom viewer.
  - `video`: player component with poster and quality controls.
  - `document`: file card with type icon, size, and download action.

### 7.2 Fallback/Failure Handling
- If media missing/processing: show placeholder + status badge.
- If forbidden: show “content unavailable” state.
- If corrupted/unsupported codec: show retry/download fallback.

### 7.3 Device-aware Rendering
- Mobile-first media sizing.
- Progressive enhancement for desktop (higher preview resolution).
- Bandwidth-aware behavior (reduced autoplay, lower-quality initial streams).

---

## 8) Media Caching Design

### 8.1 CDN Caching
- Public assets served with long `Cache-Control` max-age and immutable keys.
- Versioned object keys for safe cache busting after edits/replacements.

### 8.2 Application/API Caching
- Feed page responses cached in Redis per user cursor window (short TTL).
- Media metadata (dimensions, duration, mime, thumbnail URLs) cached to reduce DB reads.

### 8.3 Client-side Caching
- Browser cache for thumbnails and static media URLs.
- Service worker (optional) for recent feed media in low-connectivity environments.

### 8.4 Invalidation Rules
- New post: fan-out invalidation for relevant feed keys.
- Post edit/delete: invalidate post detail + impacted timeline windows.
- Privacy change: aggressively invalidate previously public URLs/keys.

---

## 9) End-to-End Feature Summary
- Users can register, authenticate securely, manage rich profiles, and browse personalized or chronological feeds.
- Posting supports text, images, videos, and documents with type-specific rendering and moderation controls.
- Media uploads are direct-to-Spaces with presigned URLs and processing-aware publishing.
- Video streaming is delivered directly from Spaces/CDN with a policy-driven choice between presigned and public URLs.
- Feed and media performance is handled through lazy loading, cursor pagination, and layered caching (CDN + Redis + browser).
