I need to build a self-hosted admin panel for managing my portfolio website (leff.in). This will run as a Docker container on my NUC, accessible at admin.leff.in via Cloudflared + nginx (already configured for other services).

## Architecture

- **Portfolio site**: Next.js on Vercel, deployed from GitHub repo `falcyon/react-portfolio-2025` (branch: `refresh`)
- **This admin app**: Standalone Node.js server in Docker on my NUC
- **Content model**: Each project is a single JSON file at `src/projects/[slug].json` in the portfolio repo
- **Workflow**: Admin edits project → saves JSON + media to local repo clone → commits and pushes → Vercel auto-deploys

## Project JSON schema

Each project file (`src/projects/[slug].json`) has this structure:

```json
{
  "name": "Project Name",
  "slug": "project-name",
  "year": 2025,
  "tags": ["Tag1", "Tag2"],
  "description": "Short description",
  "thumbnail": "/media/thumbnails/project-name.mp4",
  "thumbnailWidth": 1080,
  "thumbnailHeight": 1080,
  "size": "t",
  "position": 2,
  "order": 0,
  "content": [
    {
      "sections": [
        { "type": "text", "size": "h", "text": ["paragraph 1", "paragraph 2"] },
        { "type": "image", "size": "h", "src": "/media/slug/image.jpg", "alt": "Description" },
        { "type": "video", "size": "f", "src": "/media/slug/video.mp4", "alt": "Description" }
      ]
    }
  ]
}
```

- **size** (project thumbnail): one of `s`, `q`, `t`, `h`, `1`, `f`
- **position**: optional, 1-6
- **order**: display order in gallery (0 = first)
- **Section sizes**: `h` (half), `f` (full), `t` (third), `t2` (two-thirds), `q` (quarter), `s` (small), `1` (single)

## After saving a project, the admin must also run:

`node scripts/generate-projects-array.mjs`

This regenerates `src/data/projects.ts` (a static array used by client components) from the JSON files.

## Requirements

### Stack
- Node.js + Express (or Fastify)
- Tiptap for rich text editing (bold, italic, underline, links)
- File upload with drag-and-drop
- ffmpeg for video processing (already installed on NUC)
- Docker + docker-compose
- Password-protected (simple env var password, session-based)

### Admin UI features
- List all projects (read from src/projects/*.json in the repo clone)
- Create / edit / delete projects
- Form fields: name, slug (auto-generated from name, editable), year, tags, description, thumbnail, size, position, order
- Content editor: ordered list of section groups, each with sections (text/image/video)
- Text sections: Tiptap rich text editor, output as array of paragraph strings
- Image sections: file upload + alt text
- Video sections: file upload + alt text, triggers ffmpeg processing
- Reorder sections and section groups via up/down buttons

### Video processing (ffmpeg)
When a video is uploaded:
1. Analyze with ffprobe (resolution, duration, codec)
2. Transcode to web-optimized versions:
   - 1080p (H.264, CRF 23, 24fps, no audio)
   - 720p (H.264, CRF 25, 24fps)
   - 480p (H.264, CRF 28, 24fps)
   - Skip qualities higher than input resolution
3. Generate poster thumbnail (first frame or at 1s)
4. Output to: public/media/[slug]/ in the repo clone

### Git integration
- The Docker container mounts the portfolio repo clone as a volume
- After saving a project: write JSON, copy media, run generate-projects-array.mjs
- Provide a "Commit & Push" button that runs git add, commit, push
- Show git status in the UI

### Docker setup
- Dockerfile with Node.js + ffmpeg
- docker-compose.yml with volume mount to the repo clone
- Environment variables: ADMIN_PASSWORD, REPO_PATH (path to mounted repo)

### Security
- Password gate (check against ADMIN_PASSWORD env var)
- Session stored in cookie
- Only accessible via admin.leff.in (Cloudflared handles HTTPS)
