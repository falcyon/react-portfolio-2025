I need to build a self-hosted admin panel for managing my portfolio website (leff.in). This will run as a Docker container on my NUC, accessible at admin.leff.in via Cloudflared + nginx (already configured for other services).

## Architecture

- **Portfolio site**: Next.js on Vercel, deployed from GitHub repo `falcyon/react-portfolio-2025` (branch: `refresh`)
- **This admin app**: Standalone Node.js server in Docker on my NUC
- **Content model**: All editable content lives in `src/content/` in the portfolio repo
- **Media model**: Optimized media lives in `public/media/[slug]/` — originals stay on the NUC, only processed files go to the repo
- **Workflow**: Admin edits content → saves JSON + optimized media to local repo clone → commits and pushes → Vercel auto-deploys (no manual build trigger needed — the build script runs `generate-projects-array.mjs` automatically before `next build`)

## Content directory structure

All admin-editable content is in `src/content/`:

```
src/content/
├── projects/              # One JSON file per project
│   ├── ephemera.json
│   ├── palimpsest.json
│   └── ...
├── about.json             # Bio, exhibitions, speaking, press
├── lab.json               # Lab experiments list
└── news.json              # News ticker items
```

## Project JSON schema

Each project file (`src/content/projects/[slug].json`) has this structure:

```json
{
  "name": "Project Name",
  "slug": "projectName",
  "year": 2025,
  "tags": ["Tag1", "Tag2"],
  "description": "Short description",
  "thumbnail": "/media/projectName/filename.mp4",
  "thumbnailWidth": 1080,
  "thumbnailHeight": 1080,
  "size": "2x2",
  "position": 2,
  "order": 0,
  "featured": true,
  "featuredOrder": 0,
  "content": [
    {
      "sections": [
        { "type": "text", "size": "h", "text": ["paragraph 1", "paragraph 2"] },
        { "type": "image", "size": "h", "src": "/media/projectName/image.jpg", "alt": "Description" },
        { "type": "video", "size": "f", "src": "/media/projectName/video.mp4", "alt": "Description" }
      ]
    }
  ]
}
```

### Field reference

- **size** (grid thumbnail size): `1x1`, `1x2`, `2x1`, `2x2`
- **position**: optional, 1–6 (placement hint within the grid)
- **order**: display order in gallery (0 = first)
- **featured**: boolean — whether this project appears on the landing page featured section
- **featuredOrder**: number — sort order among featured projects (0 = first)
- **thumbnail**: path to the thumbnail media file, stored inside the project's media folder (e.g., `/media/ephemera/ephemera.mp4`). The admin provides the filename — do not rename to a generic name like `thumbnail.ext`
- **Section sizes**: `h` (half), `f` (full), `t` (third), `t2` (two-thirds), `q` (quarter), `s` (small), `1` (single)

## about.json schema

```json
{
  "name": "Leffin",
  "summary": "Multidisciplinary New Media Artist...",
  "credentials": {
    "education": [
      { "text": "MFA Design & Technology, Parsons", "note": "Honors" },
      { "text": "B.Tech Aerospace, IIT Bombay", "note": "Minor in Industrial Design" }
    ],
    "current": "Experience Design Lead, Citibank"
  },
  "contact": {
    "email": "leffin7@gmail.com",
    "instagram": "https://www.instagram.com/leff.in",
    "linkedin": "https://www.linkedin.com/in/leffin",
    "resume": "/Leffin_Resume.pdf"
  },
  "exhibitions": [
    { "venue": "...", "work": "...", "slug": "...", "location": "...", "year": "2025", "href": "https://..." }
  ],
  "speaking": [
    { "event": "...", "role": "...", "year": "2023", "href": "https://..." }
  ],
  "press": [
    { "publication": "...", "type": "Artist Feature", "year": "2024", "href": "https://..." }
  ]
}
```

## news.json schema

Each news item has an explicit `expires` date set by the admin (not auto-expiring):

```json
[
  {
    "text": "Preparing for Currents New Media Festival 2026",
    "link": "https://currentsnewmedia.org",
    "linkText": "Currents",
    "date": "2026-02-01",
    "expires": "2026-08-01"
  }
]
```

Items are hidden from the site when `expires` is in the past.

## lab.json schema

```json
[
  {
    "name": "Dino Revenge",
    "description": "A Gemini-powered twist on the Chrome dinosaur game.",
    "href": "/lab/dinoRevenge"
  },
  {
    "name": "Human Condition",
    "description": "Real-time body segmentation with pose detection overlays.",
    "href": "https://editor.p5js.org/Falcyon/full/NmCT_pCwr",
    "thumbnail": "/media/humanCondition/portraiture.mp4"
  }
]
```

## Media organization

All media is organized per-project in `public/media/[slug]/`:

```
public/media/
├── ephemera/
│   ├── ephemera.mp4        # thumbnail (original filename, not renamed)
│   ├── img1.jpg             # detail media
│   └── ...
├── palimpsest/
│   ├── palimpsest2.mp4
│   └── ...
├── zoe/                     # future project, keep
└── ...
```

**Important**: Thumbnail files keep their original filenames — the admin provides the filename and the project JSON stores the full path (e.g., `/media/ephemera/ephemera.mp4`). Do not rename files to `thumbnail.ext`.

Site-level assets (`Logo.png`, `favicon.png`, `Leffin_Resume.pdf`) are in `public/` root, not in `media/`.

### Media optimization strategy

- **Originals stay on the NUC** — the NUC is the archive for raw/uncompressed media
- **Only optimized/compressed files** are written to the portfolio repo's `public/media/[slug]/`
- This keeps the git repo lean and Vercel deploys fast

## Auto-generation (no manual step needed)

The portfolio's build command is:

```
node scripts/generate-projects-array.mjs && next build
```

This means `src/data/projects.ts` (a static array used by client components) is automatically regenerated from the project JSONs every time Vercel builds. The admin does **not** need to run `generate-projects-array.mjs` manually or trigger a Vercel build — just commit and push to the `refresh` branch, and Vercel auto-deploys.

## What the admin writes to

The Docker container mounts the portfolio repo clone and writes to:

| Content type | File path(s) |
|---|---|
| Project data | `src/content/projects/[slug].json` |
| About page | `src/content/about.json` |
| News ticker | `src/content/news.json` |
| Lab experiments | `src/content/lab.json` |
| Project media | `public/media/[slug]/` (optimized files only) |

## Requirements

### Stack
- Node.js + Express (or Fastify)
- Tiptap for rich text editing (bold, italic, underline, links)
- File upload with drag-and-drop
- ffmpeg for video processing (already installed on NUC)
- Docker + docker-compose
- Password-protected (simple env var password, session-based)

### Admin UI features
- **Projects**: List, create, edit, delete projects (read/write `src/content/projects/*.json`)
  - Form fields: name, slug (auto-generated from name, editable), year, tags, description, thumbnail, size, position, order, **featured** (toggle), **featuredOrder** (number)
  - Content editor: ordered list of section groups, each with sections (text/image/video)
  - Text sections: Tiptap rich text editor, output as array of paragraph strings
  - Image sections: file upload + alt text
  - Video sections: file upload + alt text, triggers ffmpeg processing
  - Reorder sections and section groups via up/down buttons
- **About**: Edit bio, credentials, exhibitions, speaking engagements, press (read/write `src/content/about.json`)
- **News**: Manage news ticker items with explicit expiration dates (read/write `src/content/news.json`)
- **Lab**: Manage lab experiments list (read/write `src/content/lab.json`)

### Video processing (ffmpeg)
When a video is uploaded:
1. Analyze with ffprobe (resolution, duration, codec)
2. Transcode to web-optimized versions:
   - 1080p (H.264, CRF 23, 24fps, no audio)
   - 720p (H.264, CRF 25, 24fps)
   - 480p (H.264, CRF 28, 24fps)
   - Skip qualities higher than input resolution
3. Generate poster thumbnail (first frame or at 1s)
4. Output to: `public/media/[slug]/` in the repo clone (keep original filenames)

### Git integration
- The Docker container mounts the portfolio repo clone as a volume
- After saving: write JSON + copy optimized media to repo
- Provide a "Commit & Push" button that runs git add, commit, push
- Show git status in the UI
- Pushing to `refresh` branch auto-triggers Vercel deploy — no manual build needed

### Docker setup
- Dockerfile with Node.js + ffmpeg
- docker-compose.yml with volume mount to the repo clone
- Environment variables: ADMIN_PASSWORD, REPO_PATH (path to mounted repo)

### Security
- Password gate (check against ADMIN_PASSWORD env var)
- Session stored in cookie
- Only accessible via admin.leff.in (Cloudflared handles HTTPS)
