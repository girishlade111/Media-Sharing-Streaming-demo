# Media Sharing Platform — Backend API Design (No Code)

## 1) Backend Responsibilities

### 1.1 User Management
- Register and authenticate users.
- Manage sessions/tokens and enforce authorization for protected resources.
- Expose user identity and profile basics needed by feed/post APIs.

### 1.2 Post Management
- Create and retrieve posts containing text and optional attached media.
- Serve timeline feeds and post detail data.
- Handle engagement primitives (likes/comments counters and joins).

### 1.3 Media Upload & Retrieval
- Generate secure, short-lived presigned upload URLs for DigitalOcean Spaces.
- Store and validate media metadata after direct client upload.
- Serve media access URLs (public CDN or signed/private) through retrieval APIs.

### 1.4 Platform Integrity
- Enforce upload limits and file-type policy.
- Validate ownership links between user, post, and media objects.
- Provide auditable metadata for moderation, abuse response, and lifecycle tracking.

---

## 2) API Endpoint Design

Base path suggestion: `/api/v1`

## 2.1 `POST /upload`
### Purpose
Initialize media upload and return presigned URL data.

### Request (conceptual)
- Auth token (required).
- Payload:
  - `filename`
  - `mimeType`
  - `sizeBytes`
  - `mediaType` (`image|video|document`)
  - `checksum` (optional but recommended)

### Backend logic
1. Authenticate user.
2. Validate quota + file size/type policy.
3. Create pending `media_files` row with status `initiated`.
4. Generate object key (`uploads/users/{userId}/...`).
5. Generate presigned PUT URL to DigitalOcean Spaces.
6. Return upload contract (URL + headers + mediaId + expiration).

### Response (conceptual)
- `mediaId`
- `objectKey`
- `uploadUrl` (presigned)
- `requiredHeaders`
- `expiresAt`
- `maxAllowedSize`

---

## 2.2 `POST /create-post`
### Purpose
Create post record and attach one or more uploaded media items.

### Request
- Auth token (required).
- Payload:
  - `text` (optional for media-only posts)
  - `mediaIds[]` (optional for text-only posts)
  - `visibility` (`public|followers|private`)

### Backend logic
1. Authenticate user.
2. Validate post constraints (text length, max media count).
3. For each `mediaId`:
   - Verify media exists.
   - Verify `owner_user_id == auth_user_id`.
   - Verify status is upload-complete/ready.
4. Create `posts` row.
5. Link media to post (set `post_id` or via mapping table if needed).
6. Return created post snapshot.

### Response
- `postId`
- post payload (author, text, media manifests, timestamps)

---

## 2.3 `GET /feed`
### Purpose
Return timeline feed with post cards and lightweight media descriptors.

### Query params
- `cursor` (pagination token)
- `limit` (e.g., default 20, max 50)
- `type` (optional filter: `all|text|image|video|document`)

### Backend logic
1. Authenticate (if personalized feed) or allow public mode for unauthenticated.
2. Fetch posts ordered by ranking policy (or chronology for MVP).
3. Join author + media metadata + engagement aggregates.
4. For each media item, return retrieval strategy:
   - public CDN URL OR
   - signed URL reference endpoint if private.
5. Return next cursor.

### Response
- `items[]` (post cards)
- `nextCursor`
- `hasMore`

---

## 2.4 `GET /post/:id`
### Purpose
Return full detail for a single post.

### Backend logic
1. Resolve post by ID.
2. Authorize visibility relative to requester.
3. Return full text, media list, author info, counts, timestamps.
4. Return comments preview and whether requester liked/saved.

### Response
- `post`
- `media[]`
- `engagement`
- `viewerState`

---

## 2.5 `GET /media/:id`
### Purpose
Provide secure retrieval contract for a media asset.

### Backend logic
1. Authenticate (required for protected media; optional for public).
2. Resolve media metadata and associated post visibility.
3. Authorize access.
4. Return one of:
   - public CDN URL (long-lived), or
   - short-lived presigned GET URL (private), or
   - stream manifest URL for video.

### Response
- `mediaId`
- `mediaType`
- `deliveryMode` (`cdn_public|signed_private`)
- `url`
- `expiresAt` (if signed)
- `contentType`, `sizeBytes`, `checksum`

---

## 3) Upload Flow (DigitalOcean Spaces)

1. **Client requests upload URL** via `POST /upload` with filename/type/size.
2. **Backend generates presigned URL** using S3-compatible SDK against DigitalOcean Spaces bucket.
3. **Client uploads directly to Spaces** using returned URL and headers.
4. **Backend stores metadata** in `media_files` (initially pending, then confirmed).

### Practical completion handling
Two common patterns (can be combined):
- **Client finalize call**: client calls a `POST /upload/complete` style endpoint with `mediaId` after successful PUT.
- **Async verifier/worker**: backend validates object existence (HEAD request), extracts metadata, and marks as `ready`.

For this design, `POST /create-post` must reject media not yet marked `ready`.

---

## 4) Authentication Design

### 4.1 Auth Model
- JWT access token (short TTL).
- Refresh token rotation (longer TTL, server-tracked sessions).

### 4.2 Protected Endpoints
- Require auth: `POST /upload`, `POST /create-post`, personalized `GET /feed`.
- Conditional auth: `GET /post/:id`, `GET /media/:id` (public content may be anonymous).

### 4.3 Authorization Rules
- Only media owner can attach a media item to new post.
- Post/media visibility enforced at query time (`public/followers/private`).
- Private media retrieval always uses signed URLs with short expiration.

---

## 5) Upload Security Controls

### 5.1 Input & Policy Validation
- MIME whitelist by media type.
- Max size enforcement before presign.
- Filename sanitization and server-generated object keys.

### 5.2 Presigned URL Hardening
- Very short expiry window (e.g., 5–15 minutes).
- Restrict method to PUT and expected content-type.
- Optional checksum/content-md5 verification.

### 5.3 Abuse Prevention
- Per-user rate limits on `/upload`.
- Daily upload quota enforcement.
- Malware scanning pipeline for document types before `ready` state.

### 5.4 Access Security
- Private objects not publicly listed.
- Download/stream for private assets only through authorized signed URL flow.

---

## 6) Media Metadata Storage

Store normalized metadata in `media_files` so feed/post responses do not depend on live storage introspection.

Recommended fields:
- Identity: `id`, `owner_user_id`, `post_id` (nullable until attached)
- Storage: `bucket`, `region`, `object_key`, `cdn_url` (nullable)
- Classification: `media_type`, `mime_type`, `file_ext`
- Technical: `size_bytes`, `checksum`, `width`, `height`, `duration_seconds`, `page_count`
- Lifecycle: `status` (`initiated|uploaded|processing|ready|failed|deleted`)
- Audit: `created_at`, `updated_at`, `uploaded_at`

Video-specific optional metadata:
- `stream_manifest_key`
- `transcode_profile`
- `thumbnail_key`

Document-specific optional metadata:
- `preview_key`
- `is_downloadable`

---

## 7) Database Schema Design

## 7.1 `users`
Core identity table.
- `id` (PK)
- `username` (unique)
- `email` (unique)
- `password_hash`
- `display_name`
- `avatar_media_id` (nullable FK -> media_files.id)
- `created_at`, `updated_at`

## 7.2 `posts`
Post container.
- `id` (PK)
- `author_user_id` (FK -> users.id)
- `text_content` (nullable)
- `visibility` (`public|followers|private`)
- `status` (`published|hidden|deleted`)
- `created_at`, `updated_at`

## 7.3 `media_files`
Uploaded asset table.
- `id` (PK)
- `owner_user_id` (FK -> users.id)
- `post_id` (nullable FK -> posts.id)
- `media_type` (`image|video|document`)
- `mime_type`
- `object_key` (unique)
- `cdn_url` (nullable)
- `size_bytes`
- `status`
- `metadata_json` (optional extensibility)
- `created_at`, `updated_at`

## 7.4 `likes`
User reactions on posts.
- `id` (PK)
- `user_id` (FK -> users.id)
- `post_id` (FK -> posts.id)
- `created_at`
- Unique composite index: (`user_id`, `post_id`)

## 7.5 `comments`
Threaded post responses.
- `id` (PK)
- `post_id` (FK -> posts.id)
- `user_id` (FK -> users.id)
- `parent_comment_id` (nullable FK -> comments.id)
- `body`
- `status` (`active|hidden|deleted`)
- `created_at`, `updated_at`

---

## 8) Relationship Model

- **users 1:N posts**
  - One user authors many posts.
- **users 1:N media_files**
  - One user uploads many media files.
- **posts 1:N media_files**
  - One post can attach many media assets.
  - `media_files.post_id` nullable to support pre-post uploads.
- **users N:M posts via likes**
  - Modeled through `likes` join table.
- **posts 1:N comments**
  - One post has many comments.
- **users 1:N comments**
  - One user can create many comments.
- **comments self-reference 1:N**
  - Enables threaded replies through `parent_comment_id`.

---

## 9) Retrieval & Response Design Notes

### 9.1 Feed Payload Shaping
- Return lightweight media descriptors in feed (thumbnail, type, duration, doc icon data).
- Defer heavy/full media URL generation to `GET /media/:id` when needed for protected assets.

### 9.2 Caching Approach
- Feed query caching by cursor/user in Redis (short TTL).
- Public CDN URLs cacheable at edge for public media.
- Signed URLs intentionally short-lived and generally non-cacheable.

### 9.3 Consistency Rules
- Post creation should be transactional (post + media attach).
- Media status transitions should be idempotent.
- Soft-delete posts/media to preserve referential integrity for likes/comments history.

---

## 10) End-to-End Backend Flow Summary

1. Authenticated user requests upload contract (`POST /upload`).
2. Backend validates policy and returns presigned Spaces URL.
3. Client uploads directly to DigitalOcean Spaces.
4. Backend marks media `ready` after verification.
5. User creates post referencing ready media (`POST /create-post`).
6. Consumers fetch feed (`GET /feed`) and post details (`GET /post/:id`).
7. Clients request final media access (`GET /media/:id`) using policy-based public CDN or signed URL delivery.

This backend design cleanly separates metadata/control-plane operations from object data-plane transfer, enabling secure uploads, scalable delivery, and maintainable domain relationships.
