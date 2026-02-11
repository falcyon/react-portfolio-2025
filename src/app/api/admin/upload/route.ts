import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const publicDir = path.join(process.cwd(), "public");

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const slug = formData.get("slug") as string | null;
  const subfolder = formData.get("subfolder") as string | null; // e.g. "thumbnails" or the project slug

  if (!file || !slug) {
    return NextResponse.json(
      { error: "file and slug are required" },
      { status: 400 }
    );
  }

  const folder = subfolder || slug;
  const mediaDir = path.join(publicDir, "media", folder);
  fs.mkdirSync(mediaDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name).toLowerCase();
  const baseName = path.basename(file.name, ext);
  const safeName = baseName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `${safeName}${ext}`;
  const filePath = path.join(mediaDir, fileName);

  fs.writeFileSync(filePath, buffer);

  const isVideo = [".mp4", ".webm", ".mov", ".avi", ".mkv"].includes(ext);
  const publicPath = `/media/${folder}/${fileName}`;

  if (isVideo) {
    // Process video with ffmpeg
    try {
      const variants = await processVideo(filePath, mediaDir, safeName);
      return NextResponse.json({
        success: true,
        path: publicPath,
        variants,
        type: "video",
      });
    } catch (err) {
      // Return the original file path even if processing fails
      return NextResponse.json({
        success: true,
        path: publicPath,
        type: "video",
        processingError: (err as Error).message,
      });
    }
  }

  return NextResponse.json({
    success: true,
    path: publicPath,
    type: "image",
  });
}

interface VideoVariant {
  quality: string;
  path: string;
  width: number;
  height: number;
}

async function processVideo(
  inputPath: string,
  outputDir: string,
  baseName: string
): Promise<VideoVariant[]> {
  const { execSync } = await import("child_process");

  // Get video info
  const probeOutput = execSync(
    `ffprobe -v quiet -print_format json -show_streams "${inputPath}"`
  ).toString();

  const probe = JSON.parse(probeOutput);
  const videoStream = probe.streams?.find(
    (s: { codec_type: string }) => s.codec_type === "video"
  );

  if (!videoStream) {
    throw new Error("No video stream found");
  }

  const inputWidth = parseInt(videoStream.width);
  const inputHeight = parseInt(videoStream.height);

  // Define quality presets
  const presets = [
    { name: "1080p", width: 1920, height: 1080, crf: 23 },
    { name: "720p", width: 1280, height: 720, crf: 25 },
    { name: "480p", width: 854, height: 480, crf: 28 },
  ];

  const variants: VideoVariant[] = [];

  // Generate poster image
  const posterPath = path.join(outputDir, `${baseName}-poster.jpg`);
  execSync(
    `ffmpeg -y -i "${inputPath}" -vframes 1 -ss 00:00:01 -q:v 2 "${posterPath}"`,
    { stdio: "pipe" }
  );

  for (const preset of presets) {
    // Skip quality levels higher than input
    if (preset.width > inputWidth && preset.height > inputHeight) {
      continue;
    }

    const outputPath = path.join(
      outputDir,
      `${baseName}-${preset.name}.mp4`
    );

    // Scale to fit within preset dimensions, maintaining aspect ratio
    const scale = `scale='min(${preset.width},iw)':min'(${preset.height},ih)':force_original_aspect_ratio=decrease`;

    execSync(
      `ffmpeg -y -i "${inputPath}" -vf "${scale}" -c:v libx264 -preset medium -crf ${preset.crf} -r 24 -an -movflags +faststart "${outputPath}"`,
      { stdio: "pipe", timeout: 300000 } // 5 min timeout
    );

    const stats = fs.statSync(outputPath);
    if (stats.size > 0) {
      // Get actual output dimensions
      const outProbe = execSync(
        `ffprobe -v quiet -print_format json -show_streams "${outputPath}"`
      ).toString();
      const outStream = JSON.parse(outProbe).streams?.[0];

      variants.push({
        quality: preset.name,
        path: `/media/${path.basename(outputDir)}/${baseName}-${preset.name}.mp4`,
        width: parseInt(outStream?.width || preset.width),
        height: parseInt(outStream?.height || preset.height),
      });
    }
  }

  return variants;
}
