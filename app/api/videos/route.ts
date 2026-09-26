import { readdir } from 'node:fs/promises';
import { NextResponse } from 'next/server';

export async function GET() {
  const videoDir = 'D:/Portfolio'; // absolute path on Windows where your videos reside
  try {
    const files = await readdir(videoDir);
    const videoFiles = files.filter((f) => /\.(mp4|webm|ogg)$/i.test(f));
    // Build URLs that point to the static files served via Next.js public folder (you may need to copy them there)
    const baseUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/videos`;
    const videoUrls = videoFiles.map((filename) => `${baseUrl}/${encodeURIComponent(filename)}`);
    return NextResponse.json({ videos: videoUrls });
  } catch (err) {
    console.error('Error reading video directory', err);
    return NextResponse.json({ error: 'Unable to list videos' }, { status: 500 });
  }
}
