# Media Sharing Platform — UI System Design (No Code)

## Design Direction
A unified product UI blending:
- **Twitter**: fast timeline readability, lightweight interaction density, conversation-centric post cards.
- **Instagram**: immersive media-first browsing, polished image/video presentation, creator identity prominence.
- **Netflix**: cinematic viewing surfaces, dark mode depth, strong video player and recommendation rails.

Design principles:
1. **Media-first, text-supported**: media gets visual priority; text metadata remains clear.
2. **Low-friction authoring**: post creation and upload are one continuous flow.
3. **Predictable interaction patterns**: feed, viewers, and profile share consistent controls.
4. **Responsive by default**: mobile-first with progressively richer desktop experiences.

---

## 1) Component Architecture

### 1.1 Global Shell Components
- **AppShell**
  - Header (brand, search, notifications, profile quick menu)
  - Left Nav Rail (Home, Create, Upload, Profile, Saved)
  - Main Content Area
  - Optional Right Rail (trending tags, recommendations)
- **Top Bar / Mobile Tab Bar**
  - Mobile: bottom tab navigation with central “Create” action.
  - Desktop: top utility row + side navigation.
- **Theming System**
  - Dark-first theme with optional light mode.
  - Tokenized typography, spacing, radii, elevation, and motion timings.

### 1.2 Feed & Post Components
- **FeedContainer** (infinite list + virtualization hooks)
- **PostCard** (base card with type-specific body)
  - PostHeader (avatar, name, username, timestamp, overflow menu)
  - PostBody (text + media content renderer)
  - PostActions (like, comment, share, save, more)
  - PostMeta (view count, file size/type, processing status)
- **MediaRenderer**
  - TextBlock
  - ImageGrid / Carousel
  - EmbeddedVideoTile
  - DocumentTile

### 1.3 Viewer Components
- **LightboxViewer** (image)
- **VideoPlayerSurface** (cinematic playback)
- **DocumentPreviewPane** (inline preview + file actions)

### 1.4 Creation & Upload Components
- **PostComposer** (text + attachments + audience controls)
- **MediaDropzone** (drag/drop + click-to-upload)
- **UploadQueuePanel** (progress, retry, pause, reorder)
- **PrePublishChecklist** (validation, accessibility, privacy)

---

## 2) Main UI Pages

### 2.1 Home Feed
### Layout
- **Desktop (3-column)**
  - Left: nav rail + quick create.
  - Center: timeline feed.
  - Right: suggestions, trending, “continue watching”.
- **Tablet (2-column)**
  - Collapsed left nav, center feed, optional right contextual drawer.
- **Mobile (single column)**
  - Sticky top bar, feed stream, bottom tabs.

### Interaction Flow
1. User lands on timeline with mixed post types.
2. Scroll triggers progressive loading (infinite feed).
3. Tap media opens relevant viewer (lightbox/player/document).
4. Back returns to feed at preserved scroll position.

### Feed UI behavior
- **Infinite scrolling**
  - Cursor-based loading.
  - Skeleton cards during fetch.
  - “Back to top” floating action after deep scroll.
- **Media cards**
  - Uniform card framing with type badge (Image, Video, Doc).
  - Smart-height cards to reduce layout shift.
  - In-view prioritization for preview loading.

---

### 2.2 Post Creation Page
### Layout
- Primary composer panel centered.
- Right-side preview panel on desktop (live post preview).
- Bottom sticky action bar on mobile (Attach, Audience, Publish).

### Interaction Flow
1. Start with text (optional).
2. Add one or multiple media assets.
3. Configure visibility + metadata (caption, alt text, tags).
4. Validate and publish.

### UX Details
- Draft auto-save indicator.
- Character/file count indicators.
- Publish button state: disabled until requirements met.

---

### 2.3 Media Viewer (Unified Entry)
### Purpose
Single routed viewer shell that loads the correct specialized viewer for image/video/document while preserving context and quick navigation between post media.

### Layout
- Fullscreen overlay on desktop; full-page modal route on mobile.
- Left/right navigation for multi-media posts.
- Metadata drawer toggle (creator, caption, tags, actions).

---

### 2.4 Video Player Page
### Layout
- Large cinematic player area (16:9 default, adaptive for source ratio).
- Under-player metadata (title, creator, description, publish time).
- Side rail for related videos/media.

### Player Controls
- Play/pause, seek bar, volume, fullscreen, playback speed, quality selector.
- Subtitle toggle (future-ready).
- Network/quality status chip.

### Interaction Flow
1. Poster preview displayed first.
2. User taps play, stream starts from DigitalOcean Spaces/CDN.
3. Scrubbing requests ranged segments; quality adapts if enabled.
4. Completion triggers “next recommended media.”

---

### 2.5 Document Viewer
### Layout
- Split view:
  - Left: scrollable document preview area.
  - Right: metadata + actions.
- Mobile: stacked sections (preview first, actions below).

### Interaction Flow
1. User opens document from feed/post.
2. Inline preview loads first page(s).
3. User can zoom, navigate pages, or download original.

### Required Controls
- Download button (primary action).
- Page navigation.
- File info (type, size, upload date).

---

### 2.6 User Profile
### Layout
- Profile header: avatar, cover, name, username, bio, follow/action button.
- Stats row: posts, followers, following, media count.
- Tabbed content area:
  - Posts
  - Media
  - Videos
  - Documents
  - Saved (self only)

### Interaction Flow
1. User lands on profile header.
2. Switches tabs for content filtering by media type.
3. Opens specific post/media using the same viewer system.

---

### 2.7 Media Upload Page
### Layout
- Dedicated upload workspace:
  - Large drag-and-drop zone.
  - Queue table/list with per-file status.
  - Side panel for batch metadata settings.

### Drag & Drop Upload UX
- Dropzone states: idle, drag-over, validating, uploading, complete, error.
- Supports multi-file selection and folder-style batch flows (where available).
- Error chips per item (type mismatch, oversize, failed upload).

### Interaction Flow
1. Drag/drop files into dropzone.
2. Files validate instantly with inline feedback.
3. Upload queue starts with visible progress bars.
4. Completed uploads are attached to draft post or saved to library.

---

## 3) Post Card Design (All Media Types)

### Card Structure
1. **Header**: avatar, author, time, audience/privacy indicator.
2. **Body**:
   - Text block (collapsed/expandable).
   - Media block (one of image/video/document).
3. **Footer**:
   - Primary actions (like/comment/share/save).
   - Secondary actions (report/hide/copy link).

### Type-specific body behavior
- **Text**
  - Emphasized typography and link unfurl cards.
- **Image**
  - Single image: edge-to-edge crop-safe preview.
  - Multiple images: grid/collage with “+N” overlay when overflow.
- **Video**
  - Poster thumbnail with play CTA and duration chip.
  - Optional silent hover preview on desktop only.
- **Document**
  - Document icon + filename + summary metadata.
  - Inline preview thumbnail and clear download CTA.

---

## 4) Media Display Patterns

### 4.1 Images — Lightbox Preview
- Tap image to open lightbox.
- Supports zoom, pan, swipe/arrow navigation.
- Background dim + focus lock.
- Caption and alt text visible in side/bottom panel.

### 4.2 Videos — Embedded Streaming Player
- Embedded player inside post card for quick consumption.
- Expands to dedicated video page for immersive viewing.
- Progressive loading: poster -> initial buffer -> playback.

### 4.3 Documents — Preview + Download
- Inline first-page preview thumbnail in card.
- Open document viewer for deeper preview.
- Download button always visible and clearly labeled.

---

## 5) Interaction Model

### 5.1 Feed-to-Viewer Continuity
- Opening media preserves timeline position.
- Closing viewer restores user to exact scroll location.
- Optional picture-in-picture mini player while browsing (video).

### 5.2 Motion & Feedback
- Subtle card hover/press transitions.
- Loading states: skeletons, shimmer, and buffered progress indicators.
- Toast feedback for upload complete/error, save, copy link.

### 5.3 Accessibility-first UX
- Keyboard navigation for all major controls.
- Focus-visible states across components.
- Alt text prompts for images before publish.
- Sufficient contrast in dark and light themes.

---

## 6) Responsive Design Strategy

### 6.1 Breakpoint Strategy
- **Mobile (≤768px)**
  - Single-column feed.
  - Bottom tab navigation.
  - Fullscreen media viewers.
- **Tablet (769–1024px)**
  - Two-column adaptive layout.
  - Condensed rails and collapsible metadata panels.
- **Desktop (>1024px)**
  - Three-column layout with persistent context rails.
  - Rich hover interactions and side-by-side preview panels.

### 6.2 Adaptive Media Behavior
- Serve smaller thumbnails on mobile, higher resolution on desktop.
- Prefer tap-based interactions on touch devices.
- Minimize autoplay and heavy preload on constrained connections.

### 6.3 Performance UX
- Lazy load off-screen media.
- Prioritize above-the-fold content and first visible cards.
- Avoid layout shifts via fixed media placeholders/aspect-ratio boxes.

---

## 7) End-to-End UI Flow Summary
1. User enters **Home Feed** and browses infinite media cards.
2. User opens media in context-specific viewers (image lightbox, video player, doc viewer).
3. User creates content via **Post Creation** or **Upload Page** with drag-drop flow.
4. User publishes and immediately sees the post rendered in feed/profile.
5. Profile and media pages reuse the same card/viewer patterns for consistency.

This UI system ensures social-feed familiarity (Twitter), visual storytelling quality (Instagram), and premium media viewing (Netflix), while remaining responsive, performant, and scalable.
