  ✦ Media Sharing & Streaming Platform Architecture

    1. Full System Architecture

      1 ┌─────────────────────────────────────────────────────────────────────────────┐
      2 │                              CLIENT LAYER                                    │
      3 │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
      4 │  │   Web Browser   │  │   Mobile App    │  │   Admin Panel   │              │
      5 │  │   (React/Next)  │  │   (Optional)    │  │   (Dashboard)   │              │
      6 │  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
      7 └───────────┼────────────────────┼────────────────────┼────────────────────────┘
      8             │                    │                    │
      9             └────────────────────┼────────────────────┘
     10                                  │ HTTPS/WSS
     11                                  ▼
     12 ┌─────────────────────────────────────────────────────────────────────────────┐
     13 │                              EDGE LAYER                                      │
     14 │  ┌─────────────────────────────────────────────────────────────────────┐    │
     15 │  │                    DigitalOcean CDN                                  │    │
     16 │  │              (Cached media delivery globally)                        │    │
     17 │  └─────────────────────────────────────────────────────────────────────┘    │
     18 │  ┌─────────────────┐                    ┌─────────────────┐                 │
     19 │  │  Load Balancer  │───────────────────▶│   API Gateway   │                 │
     20 │  │   (DO LB)       │                    │  (Rate limiting)│                 │
     21 │  └─────────────────┘                    └────────┬────────┘                 │
     22 └───────────────────────────────────────────────────┼─────────────────────────┘
     23                                                     │
     24                                                     ▼
     25 ┌─────────────────────────────────────────────────────────────────────────────┐
     26 │                           APPLICATION LAYER                                  │
     27 │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
     28 │  │   REST API      │  │  WebSocket      │  │  Background     │              │
     29 │  │   (Node.js)     │  │  Server         │  │  Workers        │              │
     30 │  │                 │  │  (Real-time)    │  │  (Queues)       │              │
     31 │  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
     32 └───────────┼────────────────────┼────────────────────┼────────────────────────┘
     33             │                    │                    │
     34             └────────────────────┼────────────────────┘
     35                                  │
     36             ┌────────────────────┼────────────────────┐
     37             ▼                    ▼                    ▼
     38 ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────────┐
     39 │   PostgreSQL    │  │     Redis       │  │    DigitalOcean Spaces          │
     40 │   (Primary DB)  │  │  (Cache/Queue)  │  │    (S3-compatible storage)      │
     41 │                 │  │                 │  │    ┌─────────────────────────┐  │
     42 │  - Users        │  │  - Sessions     │  │    │  buckets/               │  │
     43 │  - Posts        │  │  - Rate limits  │  │    │  ├── uploads/           │  │
     44 │  - Media        │  │  - Job queues   │  │    │  ├── transcodes/        │  │
     45 │  - Comments     │  │  - Cache        │  │    │  └── thumbnails/        │  │
     46 │  - Analytics    │  │                 │  │    └─────────────────────────┘  │
     47 └─────────────────┘  └─────────────────┘  └─────────────────────────────────┘

    ---

    2. Frontend Stack Recommendation


    ┌────────────────────┬────────────────────────────────┬──────────────────────────────────────────┐
    │ Layer              │ Technology                     │ Rationale                                │
    ├────────────────────┼────────────────────────────────┼──────────────────────────────────────────┤
    │ Framework          │ Next.js 14+ (App Router)       │ SSR/SSG, API routes, excellent DX        │
    │ Language           │ TypeScript                     │ Type safety, better maintainability      │
    │ State              │ Zustand + React Query          │ Lightweight state + server state caching │
    │ Styling            │ Tailwind CSS + shadcn/ui       │ Rapid UI development, consistent design  │
    │ Video Player       │ Video.js / Plyr                │ HLS support, adaptive streaming          │
    │ Document Viewer    │ react-pdf, mammoth.js          │ PDF/DOCX rendering in-browser            │
    │ Upload             │ react-dropzone + tus-js-client │ Resumable uploads, progress tracking     │
    │ Image Optimization │ next/image                     │ Automatic optimization, lazy loading     │
    └────────────────────┴────────────────────────────────┴──────────────────────────────────────────┘

    ---

    3. Backend Stack Recommendation


    ┌──────────────────┬────────────────────────────────┬────────────────────────────────────────────────┐
    │ Component        │ Technology                     │ Rationale                                      │
    ├──────────────────┼────────────────────────────────┼────────────────────────────────────────────────┤
    │ Runtime          │ Node.js 20+ LTS                │ Non-blocking I/O, great for streaming          │
    │ Framework        │ Fastify or Express             │ Fastify for performance, Express for ecosystem │
    │ ORM              │ Prisma or Drizzle              │ Type-safe database access                      │
    │ Auth             │ Lucia Auth or JWT              │ Session management, OAuth support              │
    │ Validation       │ Zod                            │ Runtime type validation                        │
    │ File Upload      │ @aws-sdk/client-s3             │ Direct S3-compatible uploads                   │
    │ Video Processing │ fluent-ffmpeg + worker threads │ Transcoding pipeline                           │
    │ Queue            │ BullMQ (Redis-backed)          │ Job processing, retries, scheduling            │
    │ Logging          │ Pino + DO Logging              │ Structured logs, performance                   │
    └──────────────────┴────────────────────────────────┴────────────────────────────────────────────────┘

    ---

    4. Media Streaming Architecture

    Video Streaming Flow

      1 ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
      2 │   Original   │────▶│  Transcode   │────▶│   HLS/DASH   │────▶│     CDN      │
      3 │   Upload     │     │   (Worker)   │     │   Packaging  │     │  (Edge)      │
      4 └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
      5        │                    │                    │                    │
      6        │                    ▼                    ▼                    ▼
      7        │            ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
      8        │            │ 1080p, 720p, │     │ .m3u8        │     │ Cached at    │
      9        │            │ 480p, 360p   │     │ .ts segments │     │ edge nodes   │
     10        │            │ MP4 + WEBM   │     │ Adaptive     │     │ globally     │
     11        │            └──────────────┘     │ bitrate      │     └──────────────┘
     12        │                                 └──────────────┘
     13        ▼
     14 ┌──────────────┐
     15 │  Thumbnail   │
     16 │  Generation  │
     17 │  (FFmpeg)    │
     18 └──────────────┘

    Streaming Strategy


    ┌─────────────┬───────────────────────────────────┬───────────────────────────────────┐
    │ Media Type  │ Delivery Method                   │ Notes                             │
    ├─────────────┼───────────────────────────────────┼───────────────────────────────────┤
    │ Images      │ Direct CDN URL                    │ WebP conversion on upload         │
    │ Videos      │ HLS Adaptive Streaming            │ Multiple bitrates, .m3u8 playlist │
    │ Documents   │ Signed URLs + In-browser render   │ PDF.js, mammoth.js for preview    │
    │ Large Files │ Chunked download + Resume support │ Range requests enabled            │
    └─────────────┴───────────────────────────────────┴───────────────────────────────────┘

    ---

    5. Upload Flow

      1 ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
      2 │  Client │────▶│   API   │────▶│  Presign│────▶│  Spaces │────▶│  Queue  │
      3 │         │     │         │     │  URL    │     │         │     │  (Jobs) │
      4 └─────────┘     └─────────┘     └─────────┘     └─────────┘     └─────────┘
      5      │               │               │               │               │
      6      │ 1. Request    │               │               │               │
      7      │    upload     │               │               │               │
      8      │               │               │               │               │
      9      │               │ 2. Generate   │               │               │
     10      │               │    presigned  │               │               │
     11      │               │    URL        │               │               │
     12      │               │               │               │               │
     13      │ 3. Receive    │◀──────────────│               │               │
     14      │    presigned  │               │               │               │
     15      │    URL        │               │               │               │
     16      │               │               │               │               │
     17      │ 4. Direct     │               │               │               │
     18      │    upload     │──────────────▶│               │               │
     19      │    (multipart)│               │               │               │
     20      │               │               │               │               │
     21      │               │               │               │ 5. Upload     │
     22      │               │               │               │    complete    │
     23      │               │               │               │               │
     24      │               │ 6. Notify     │               │               │
     25      │               │    completion │◀──────────────│               │
     26      │               │               │               │               │
     27      │               │               │               │               │
     28      │               │ 7. Queue      │               │               │
     29      │               │    processing │──────────────▶│               │
     30      │               │    job        │               │               │

    Upload Strategy


    ┌───────────┬──────────────────┬────────────────────────────┐
    │ File Size │ Method           │ Notes                      │
    ├───────────┼──────────────────┼────────────────────────────┤
    │ < 5MB     │ Single PUT       │ Simple upload              │
    │ 5MB - 5GB │ Multipart Upload │ Parallel chunks, resumable │
    │ > 5GB     │ Tus Protocol     │ Resumable, chunked         │
    └───────────┴──────────────────┴────────────────────────────┘

    ---

    6. Storage Bucket Structure

      1 digitalocean-space-name/
      2 │
      3 ├── uploads/
      4 │   ├── users/
      5 │   │   └── {user_id}/
      6 │   │       ├── profile/
      7 │   │       └── cover/
      8 │   │
      9 │   ├── posts/
     10 │   │   └── {post_id}/
     11 │   │       ├── images/
     12 │   │       │   └── {image_id}.{ext}
     13 │   │       ├── videos/
     14 │   │       │   └── {video_id}/
     15 │   │       │       ├── original.mp4
     16 │   │       │       └── thumbnails/
     17 │   │       └── documents/
     18 │   │           └── {doc_id}.{ext}
     19 │   │
     20 │   └── temp/
     21 │       └── {session_id}/
     22 │           └── (pending uploads)
     23 │
     24 ├── transcodes/
     25 │   └── videos/
     26 │       └── {video_id}/
     27 │           ├── 1080p/
     28 │           │   ├── video.m3u8
     29 │           │   └── segment_001.ts
     30 │           ├── 720p/
     31 │           ├── 480p/
     32 │           └── 360p/
     33 │
     34 ├── thumbnails/
     35 │   ├── images/
     36 │   │   └── {image_id}_thumb.{ext}
     37 │   └── videos/
     38 │       └── {video_id}_thumb.jpg
     39 │
     40 └── processed/
     41     └── documents/
     42         └── {doc_id}/
     43             └── preview.pdf

    Bucket Configuration


    ┌────────────┬─────────────────────────────┬──────────────────────────────────┐
    │ Setting    │ Value                       │ Rationale                        │
    ├────────────┼─────────────────────────────┼──────────────────────────────────┤
    │ Region     │ Closest to users            │ Lower latency (e.g., nyc3, sfo3) │
    │ ACL        │ Private                     │ All access via signed URLs       │
    │ CORS       │ Configured for web          │ Allow browser uploads            │
    │ Lifecycle  │ Auto-delete temp/ after 24h │ Cost optimization                │
    │ Versioning │ Enabled                     │ Recovery, audit trail            │
    └────────────┴─────────────────────────────┴──────────────────────────────────┘

    ---

    7. CDN Usage

      1 ┌─────────────────────────────────────────────────────────────────┐
      2 │                     DigitalOcean CDN                             │
      3 │                                                                  │
      4 │  Edge Locations: Global (140+ PoPs via partner networks)        │
      5 │                                                                  │
      6 │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
      7 │  │  North   │  │  Europe  │  │   Asia   │  │  South   │        │
      8 │  │ America  │  │          │  │          │  │ America  │        │
      9 │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
     10 │                                                                  │
     11 │  Cache Rules:                                                    │
     12 │  ┌──────────────────────────────────────────────────────────┐   │
     13 │  │ Path Pattern          │ TTL     │ Cache Key              │   │
     14 │  ├──────────────────────────────────────────────────────────┤   │
     15 │  │ /transcodes/*         │ 30 days │ URL + Range header     │   │
     16 │  │ /thumbnails/*         │ 7 days  │ URL                    │   │
     17 │  │ /uploads/posts/images │ 7 days  │ URL + Accept           │   │
     18 │  │ /uploads/users/*      │ 1 hour  │ URL                    │   │
     19 │  │ /uploads/temp/*       │ No cache│ -                      │   │
     20 │  └──────────────────────────────────────────────────────────┘   │
     21 └─────────────────────────────────────────────────────────────────┘

    CDN Strategy


    ┌────────────────┬───────────┬────────────┬─────────────────────────────────┐
    │ Content Type   │ Caching   │ Signed URL │ Notes                           │
    ├────────────────┼───────────┼────────────┼─────────────────────────────────┤
    │ Public videos  │ Yes (30d) │ Optional   │ Long TTL for popular content    │
    │ Private videos │ Yes (1h)  │ Required   │ Short TTL, auth required        │
    │ Thumbnails     │ Yes (7d)  │ No         │ Low bandwidth, high hit rate    │
    │ Documents      │ No        │ Required   │ Always fresh, access controlled │
    │ User avatars   │ Yes (1h)  │ No         │ Versioned URLs for updates      │
    └────────────────┴───────────┴────────────┴─────────────────────────────────┘

    ---

    8. Security Model

    Authentication & Authorization

      1 ┌─────────────────────────────────────────────────────────────────┐
      2 │                        Security Layers                           │
      3 ├─────────────────────────────────────────────────────────────────┤
      4 │                                                                  │
      5 │  ┌─────────────────────────────────────────────────────────┐    │
      6 │  │ 1. Transport Security                                    │    │
      7 │  │    - HTTPS everywhere (TLS 1.3)                         │    │
      8 │  │    - HSTS enabled                                       │    │
      9 │  │    - CDN SSL termination                                │    │
     10 │  └─────────────────────────────────────────────────────────┘    │
     11 │                                                                  │
     12 │  ┌─────────────────────────────────────────────────────────┐    │
     13 │  │ 2. Authentication                                        │    │
     14 │  │    - JWT tokens (short-lived: 15min)                    │    │
     15 │  │    - Refresh tokens (long-lived: 7d, rotating)          │    │
     16 │  │    - OAuth 2.0 (Google, GitHub)                         │    │
     17 │  │    - MFA support (TOTP)                                 │    │
     18 │  └─────────────────────────────────────────────────────────┘    │
     19 │                                                                  │
     20 │  ┌─────────────────────────────────────────────────────────┐    │
     21 │  │ 3. Authorization (RBAC)                                  │    │
     22 │  │    - Roles: user, moderator, admin                      │    │
     23 │  │    - Resource-level permissions                         │    │
     24 │  │    - Ownership checks on all media operations           │    │
     25 │  └─────────────────────────────────────────────────────────┘    │
     26 │                                                                  │
     27 │  ┌─────────────────────────────────────────────────────────┐    │
     28 │  │ 4. Media Access Control                                  │    │
     29 │  │    - Signed URLs (expiry: 1-24h based on content)       │    │
     30 │  │    - Bucket policies (private by default)               │    │
     31 │  │    - CORS restrictions (allowed origins only)           │    │
     32 │  └─────────────────────────────────────────────────────────┘    │
     33 │                                                                  │
     34 │  ┌─────────────────────────────────────────────────────────┐    │
     35 │  │ 5. Upload Security                                       │    │
     36 │  │    - File type validation (magic bytes, not just ext)   │    │
     37 │  │    - Size limits per media type                         │    │
     38 │  │    - Virus scanning (ClamAV in worker queue)            │    │
     39 │  │    - Content moderation (optional AI integration)       │    │
     40 │  └─────────────────────────────────────────────────────────┘    │
     41 │                                                                  │
     42 │  ┌─────────────────────────────────────────────────────────┐    │
     43 │  │ 6. API Security                                          │    │
     44 │  │    - Rate limiting (per user, per IP)                   │    │
     45 │  │    - Input validation (Zod schemas)                     │    │
     46 │  │    - SQL injection prevention (parameterized queries)   │    │
     47 │  │    - XSS prevention (CSP headers, output encoding)      │    │
     48 │  └─────────────────────────────────────────────────────────┘    │
     49 │                                                                  │
     50 └─────────────────────────────────────────────────────────────────┘

    Signed URL Flow

      1 Client Request ──▶ API validates permission ──▶ Generate signed URL
      2                                                     │
      3                                                     ▼
      4                                          URL expires in N hours
      5                                                     │
      6                                                     ▼
      7                                          Client accesses Spaces/CDN
      8                                                     │
      9                                                     ▼
     10                                          Spaces validates signature

    ---

    9. Scalability Considerations

    Horizontal Scaling Strategy

      1 ┌─────────────────────────────────────────────────────────────────────────┐
      2 │                         Scaling Architecture                             │
      3 ├─────────────────────────────────────────────────────────────────────────┤
      4 │                                                                          │
      5 │  ┌──────────────────────────────────────────────────────────────────┐   │
      6 │  │  API Layer (Stateless)                                            │   │
      7 │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                 │   │
      8 │  │  │ Instance│ │ Instance│ │ Instance│ │ Instance│  ...            │   │
      9 │  │  │    #1   │ │    #2   │ │    #3   │ │    #4   │                 │   │
     10 │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘                 │   │
     11 │  │           ▲              │              ▲                         │   │
     12 │  │           └──────────────┴──────────────┘                         │   │
     13 │  │                      Load Balancer                                │   │
     14 │  │              (Auto-scale: CPU > 70%, RPS threshold)               │   │
     15 │  └──────────────────────────────────────────────────────────────────┘   │
     16 │                                                                          │
     17 │  ┌──────────────────────────────────────────────────────────────────┐   │
     18 │  │  Worker Layer (Video Processing)                                  │   │
     19 │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                             │   │
     20 │  │  │ Worker  │ │ Worker  │ │ Worker  │  ...                        │   │
     21 │  │  │  (CPU)  │ │  (CPU)  │ │  (CPU)  │                             │   │
     22 │  │  └─────────┘ └─────────┘ └─────────┘                             │   │
     23 │  │           ▲              │              ▲                         │   │
     24 │  │           └──────────────┴──────────────┘                         │   │
     25 │  │                    Job Queue (Redis/BullMQ)                       │   │
     26 │  │              (Auto-scale: Queue depth > threshold)                │   │
     27 │  └──────────────────────────────────────────────────────────────────┘   │
     28 │                                                                          │
     29 │  ┌──────────────────────────────────────────────────────────────────┐   │
     30 │  │  Database Layer                                                   │   │
     31 │  │  ┌─────────────────────────────────────────────────────────────┐ │   │
     32 │  │  │  PostgreSQL (DigitalOcean Managed)                          │ │   │
     33 │  │  │  - Read replicas for SELECT queries                         │ │   │
     34 │  │  │  - Connection pooling (PgBouncer)                           │ │   │
     35 │  │  │  - Partitioning for large tables (posts, analytics)         │ │   │
     36 │  │  └─────────────────────────────────────────────────────────────┘ │   │
     37 │  └──────────────────────────────────────────────────────────────────┘   │
     38 │                                                                          │
     39 │  ┌──────────────────────────────────────────────────────────────────┐   │
     40 │  │  Storage Layer                                                    │   │
     41 │  │  ┌─────────────────────────────────────────────────────────────┐ │   │
     42 │  │  │  DigitalOcean Spaces (infinite scale)                       │ │   │
     43 │  │  │  - CDN for hot content                                      │ │   │
     44 │  │  │  - Direct origin for cold content                           │ │   │
     45 │  │  └─────────────────────────────────────────────────────────────┘ │   │
     46 │  └──────────────────────────────────────────────────────────────────┘   │
     47 │                                                                          │
     48 └─────────────────────────────────────────────────────────────────────────┘

    Scaling Triggers


    ┌───────────┬───────────────┬─────────────┬────────────────────────┐
    │ Component │ Metric        │ Threshold   │ Action                 │
    ├───────────┼───────────────┼─────────────┼────────────────────────┤
    │ API       │ CPU           │ > 70%       │ Add instance           │
    │ API       │ Memory        │ > 80%       │ Add instance           │
    │ API       │ Response time │ P99 > 500ms │ Add instance           │
    │ Workers   │ Queue depth   │ > 100 jobs  │ Add worker             │
    │ DB        │ Connections   │ > 80%       │ Scale up / Add replica │
    │ CDN       │ Cache miss    │ > 30%       │ Review TTL strategy    │
    └───────────┴───────────────┴─────────────┴────────────────────────┘


    ---

    10. Database Schema Overview

    Core Tables

      1 ┌─────────────────────────────────────────────────────────────────────────┐
      2 │                           Database Schema                                │
      3 ├─────────────────────────────────────────────────────────────────────────┤
      4 │                                                                          │
      5 │  ┌──────────────────┐                                                   │
      6 │  │      users       │                                                   │
      7 │  ├──────────────────┤                                                   │
      8 │  │ id (PK)          │──┐                                                │
      9 │  │ email            │  │                                                │
     10 │  │ username         │  │                                                │
     11 │  │ password_hash    │  │                                                │
     12 │  │ display_name     │  │                                                │
     13 │  │ bio              │  │                                                │
     14 │  │ avatar_url       │  │                                                │
     15 │  │ cover_url        │  │                                                │
     16 │  │ role             │  │                                                │
     17 │  │ created_at       │  │                                                │
     18 │  │ updated_at       │  │                                                │
     19 │  └──────────────────┘  │                                                │
     20 │                        │                                                │
     21 │  ┌──────────────────┐  │  ┌──────────────────┐                         │
     22 │  │      posts       │  │  │   post_media     │                         │
     23 │  ├──────────────────┤  │  ├──────────────────┤                         │
     24 │  │ id (PK)          │◀─┼──│ id (PK)          │                         │
     25 │  │ user_id (FK)     │──┘  │ post_id (FK)     │──┐                      │
     26 │  │ content          │     │ media_id (FK)    │  │                      │
     27 │  │ type             │     │ media_type       │  │                      │
     28 │  │ visibility       │     │ sort_order       │  │                      │
     29 │  │ created_at       │     │ created_at       │  │                      │
     30 │  │ updated_at       │     └──────────────────┘  │                      │
     31 │  └──────────────────┘                           │                      │
     32 │                                                 │                      │
     33 │  ┌──────────────────┐  ┌──────────────────┐    │                      │
     34 │  │      media       │  │    comments      │    │                      │
     35 │  ├──────────────────┤  ├──────────────────┤    │                      │
     36 │  │ id (PK)          │  │ id (PK)          │    │                      │
     37 │  │ user_id (FK)     │  │ post_id (FK)     │    │                      │
     38 │  │ original_name    │  │ user_id (FK)     │    │                      │
     39 │  │ storage_key      │  │ parent_id (FK)   │    │                      │
     40 │  │ mime_type        │  │ content          │    │                      │
     41 │  │ file_size        │  │ created_at       │    │                      │
     42 │  │ duration         │  └──────────────────┘    │                      │
     43 │  │ width            │                          │                      │
     44 │  │ height           │  ┌──────────────────┐    │                      │
     45 │  │ status           │  │     likes        │    │                      │
     46 │  │ metadata (JSONB) │  ├──────────────────┤    │                      │
     47 │  │ created_at       │  │ id (PK)          │◀───┘                      │
     48 │  └──────────────────┘  │ user_id (FK)     │                           │
     49 │                         │ post_id (FK)     │                           │
     50 │  ┌──────────────────┐  │ created_at       │                           │
     51 │  │    sessions      │  └──────────────────┘                           │
     52 │  ├──────────────────┤                                                 │
     53 │  │ id (PK)          │  ┌──────────────────┐                           │
     54 │  │ user_id (FK)     │  │   analytics      │                           │
     55 │  │ token_hash       │  ├──────────────────┤                           │
     56 │  │ expires_at       │  │ id (PK)          │                           │
     57 │  │ created_at       │  │ post_id (FK)     │                           │
     58 │  └──────────────────┘  │ event_type       │                           │
     59 │                         │ value            │                           │
     60 │  ┌──────────────────┐  │ metadata (JSONB) │                           │
     61 │  │  upload_jobs     │  │ created_at       │                           │
     62 │  ├──────────────────┤  └──────────────────┘                           │
     63 │  │ id (PK)          │                                                 │
     64 │  │ user_id (FK)     │                                                 │
     65 │  │ status           │                                                 │
     66 │  │ progress         │                                                 │
     67 │  │ error            │                                                 │
     68 │  │ created_at       │                                                 │
     69 │  └──────────────────┘                                                 │
     70 │                                                                          │
     71 └─────────────────────────────────────────────────────────────────────────┘

    Key Relationships


    ┌─────────────────────┬──────────────┬─────────────────────────────────┐
    │ Table               │ Relationship │ Description                     │
    ├─────────────────────┼──────────────┼─────────────────────────────────┤
    │ users → posts       │ 1:N          │ User owns many posts            │
    │ posts → post_media  │ 1:N          │ Post contains many media items  │
    │ post_media → media  │ N:1          │ Junction table for media        │
    │ users → media       │ 1:N          │ User uploads many media         │
    │ posts → comments    │ 1:N          │ Post has many comments          │
    │ comments → comments │ 1:N          │ Nested comments (replies)       │
    │ users → likes       │ N:N          │ Users like posts (via junction) │
    │ posts → analytics   │ 1:N          │ Post has many analytics events  │
    └─────────────────────┴──────────────┴─────────────────────────────────┘

    ---

    Summary

    This architecture provides:


    ┌─────────────────┬────────────────────────────────────────────────┐
    │ Aspect          │ Solution                                       │
    ├─────────────────┼────────────────────────────────────────────────┤
    │ Performance     │ CDN + HLS streaming + Redis caching            │
    │ Scalability     │ Stateless API + Queue workers + Read replicas  │
    │ Security        │ Signed URLs + RBAC + Input validation          │
    │ Reliability     │ Managed DB + Auto-scaling + Retry queues       │
    │ Cost Efficiency │ Lifecycle policies + CDN caching + Compression │
    └─────────────────┴────────────────────────────────────────────────┘

