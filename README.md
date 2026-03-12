# DigitalOcean Media Platform

A full-stack media sharing and streaming platform built to test DigitalOcean Object Storage (Spaces) performance. Combines features from Twitter, Instagram, Netflix, and document sharing platforms.

![Platform Preview](./preview.png)

## Features

### Media Support
- **Images**: JPG, PNG, GIF, WEBP
- **Videos**: MP4, WEBM (with HLS adaptive streaming)
- **Documents**: PDF, DOCX, PPTX, XLSX, TXT

### Core Functionality
- User authentication (JWT + sessions)
- Create posts with text and media
- Photo gallery with grid layouts
- Video streaming with adaptive bitrate
- Document preview in browser
- Like and comment on posts
- Public, unlisted, and private content
- Multipart uploads for large files

### Technical Highlights
- Direct-to-S3 uploads via presigned URLs
- HLS video transcoding pipeline
- CDN integration for global delivery
- Redis-backed job queues
- PostgreSQL with Prisma ORM
- Real-time upload progress

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Fastify
- **Database**: PostgreSQL (Prisma ORM)
- **Cache/Queue**: Redis (BullMQ)
- **Storage**: DigitalOcean Spaces (S3-compatible)
- **Video Processing**: FFmpeg

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand + TanStack Query
- **Video**: hls.js
- **PDF**: react-pdf

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (optional)
- DigitalOcean account with Spaces enabled

### 1. Clone and Install

```bash
cd digitalocean
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required configuration:
- **DigitalOcean Spaces**: Create a Space at [digitaloceanspaces.com](https://cloud.digitaloceans.com/spaces)
- **Database**: Use the Docker PostgreSQL or provide your own
- **Redis**: Use the Docker Redis or provide your own

### 3. Start with Docker (Recommended)

```bash
# Start all services
npm run docker:up

# Run database migrations
docker exec media_platform_backend npx prisma migrate deploy

# Access the app
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
```

### 4. Start Without Docker

```bash
# Start PostgreSQL and Redis manually
# Then update DATABASE_URL and REDIS_URL in .env

# Install dependencies
npm install

# Run migrations
npm run db:migrate

# Start backend
cd apps/backend
npm run dev

# Start frontend (new terminal)
cd apps/frontend
npm run dev
```

## Project Structure

```
digitalocean/
├── apps/
│   ├── backend/           # Fastify API server
│   │   ├── src/
│   │   │   ├── config/    # Environment config
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── routes/    # API routes
│   │   │   ├── services/  # Business logic
│   │   │   ├── utils/
│   │   │   └── workers/   # Background jobs
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   └── frontend/          # Next.js application
│       ├── src/
│       │   ├── app/       # App router pages
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/       # Utilities & API client
│       │   └── stores/    # Zustand stores
│       └── public/
│
├── docker-compose.yml
├── package.json
└── .env.example
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Sign in |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/logout` | Sign out |
| GET | `/auth/me` | Get current user |
| PATCH | `/auth/profile` | Update profile |

### Uploads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/uploads/presigned` | Get presigned upload URL |
| POST | `/uploads/multipart/init` | Initiate multipart upload |
| GET | `/uploads/multipart/part` | Get part upload URL |
| POST | `/uploads/multipart/complete` | Complete multipart upload |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | List posts (paginated) |
| GET | `/posts/:id` | Get single post |
| POST | `/posts` | Create post |
| PATCH | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Delete post |
| POST | `/posts/:id/like` | Like post |
| DELETE | `/posts/:id/like` | Unlike post |
| POST | `/posts/:id/comments` | Add comment |

### Media
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/media` | List user's media |
| GET | `/media/:id` | Get media details |
| POST | `/media` | Register uploaded media |
| DELETE | `/media/:id` | Delete media |
| GET | `/media/:id/url` | Get signed access URL |

## DigitalOcean Spaces Setup

### 1. Create a Space

1. Go to [DigitalOcean Control Panel](https://cloud.digitaloceanspaces.com)
2. Click "Create a Space"
3. Choose region (e.g., `nyc3`)
4. Name your bucket (e.g., `media-platform`)
5. Enable CDN for faster delivery

### 2. Generate API Keys

1. Go to Settings → API
2. Click "Generate New Key"
3. Save the access key and secret key

### 3. Configure CORS

In your Space settings, add this CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### 4. Update Environment

```env
DO_SPACES_KEY=your-access-key
DO_SPACES_SECRET=your-secret-key
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACES_REGION=nyc3
DO_SPACES_BUCKET=your-bucket-name
DO_SPACES_CDN_URL=https://your-bucket.nyc3.cdn.digitaloceanspaces.com
```

## Video Transcoding

The platform automatically transcodes uploaded videos to multiple qualities for adaptive streaming:

- 1080p (5000k video, 192k audio)
- 720p (2800k video, 128k audio)
- 480p (1400k video, 128k audio)
- 360p (800k video, 96k audio)

Videos are packaged in HLS format (.m3u8 playlists with .ts segments).

### Start the Worker

```bash
npm run worker
```

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User accounts and profiles
- **posts**: User posts with content
- **media**: Media file metadata
- **post_media**: Junction table for posts and media
- **comments**: Post comments (nested)
- **likes**: Post likes
- **sessions**: User sessions
- **analytics**: Event tracking
- **upload_jobs**: Upload job tracking

## Development

### Run Tests

```bash
npm test
```

### Database Commands

```bash
# Open Prisma Studio
npm run db:studio

# Create migration
npm run db:migrate

# Seed database
npm run db:seed
```

### Linting

```bash
npm run lint
```

## Deployment

### Backend (Docker)

```bash
docker build -f apps/backend/Dockerfile -t media-platform-backend .
docker run -p 4000:4000 --env-file .env media-platform-backend
```

### Frontend (Docker)

```bash
docker build -f apps/frontend/Dockerfile -t media-platform-frontend .
docker run -p 3000:3000 --env-file .env media-platform-frontend
```

### Vercel (Frontend)

1. Connect your repository to Vercel
2. Set environment variables
3. Deploy

### Railway/Render (Backend)

1. Connect your repository
2. Add PostgreSQL and Redis addons
3. Set environment variables
4. Deploy

## Performance Considerations

### Upload Optimization
- Direct browser-to-Spaces uploads (no server proxy)
- Multipart uploads for files > 5MB
- Parallel chunk uploads

### Streaming Optimization
- HLS adaptive bitrate streaming
- CDN caching at edge locations
- Thumbnail generation for quick previews

### Database Optimization
- Indexed queries on common filters
- Connection pooling via PgBouncer
- Read replicas for heavy read workloads

## Security

- JWT authentication with refresh tokens
- Signed URLs for private content access
- Input validation with Zod
- Rate limiting on all endpoints
- CORS restrictions
- File type validation (magic bytes)
- Size limits per media type

## Troubleshooting

### Upload fails
- Check CORS configuration in Spaces
- Verify API keys are correct
- Ensure bucket name matches

### Video not transcoding
- Ensure FFmpeg is installed
- Check worker is running
- Verify Redis connection

### Database connection error
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify network access

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a PR.

---

Built with ❤️ using DigitalOcean Spaces
