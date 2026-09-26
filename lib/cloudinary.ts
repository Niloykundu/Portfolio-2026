import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  thumbnailUrl?: string;
  duration?: number;
}

export interface UploadOptions {
  folder?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  transformation?: object[];
  tags?: string[];
}

// ─── Upload from Buffer ────────────────────────────────────────────────────────

export async function uploadToCloudinary(
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const {
    folder = "portfolio",
    resourceType = "auto",
    transformation,
    tags,
  } = options;

  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder,
      resource_type: resourceType,
      tags,
    };

    if (transformation) {
      uploadOptions.transformation = transformation;
    }

    // For videos, generate thumbnail
    if (resourceType === "video") {
      uploadOptions.eager = [
        {
          format: "jpg",
          transformation: [
            { width: 800, crop: "fill" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
      ];
      uploadOptions.eager_async = true;
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
          return;
        }

        const thumbnailUrl =
          result.resource_type === "video"
            ? cloudinary.url(result.public_id, {
                resource_type: "video",
                format: "jpg",
                transformation: [
                  { width: 800, height: 450, crop: "fill" },
                  { quality: "auto" },
                ],
              })
            : undefined;

        resolve({
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          resourceType: result.resource_type,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          thumbnailUrl,
          duration: (result as Record<string, unknown>).duration as number | undefined,
        });
      }
    );

    stream.end(buffer);
  });
}

// ─── Upload from URL ───────────────────────────────────────────────────────────

export async function uploadUrlToCloudinary(
  url: string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const { folder = "portfolio", resourceType = "auto" } = options;

  const result = await cloudinary.uploader.upload(url, {
    folder,
    resource_type: resourceType,
  });

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    resourceType: result.resource_type,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

// ─── Delete Media ──────────────────────────────────────────────────────────────

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

// ─── Generate Transformed URL ──────────────────────────────────────────────────

export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
    resourceType?: string;
  } = {}
): string {
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    resourceType = "image",
  } = options;

  const transformation: Record<string, unknown>[] = [
    { quality },
    { fetch_format: format },
  ];

  if (width || height) {
    transformation.unshift({ width, height, crop });
  }

  return cloudinary.url(publicId, {
    resource_type: resourceType as "image" | "video" | "raw",
    transformation,
    secure: true,
  });
}

// ─── Get Video Thumbnail ───────────────────────────────────────────────────────

export function getVideoThumbnailUrl(
  publicId: string,
  options: { width?: number; height?: number; at?: number } = {}
): string {
  const { width = 800, height = 450, at = 0 } = options;
  return cloudinary.url(publicId, {
    resource_type: "video",
    format: "jpg",
    transformation: [
      { width, height, crop: "fill" },
      { quality: "auto" },
      { start_offset: at },
    ],
    secure: true,
  });
}

export { cloudinary };
