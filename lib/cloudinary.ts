import { createHash } from "crypto";

/**
 * Cloudinary signed-upload helper. We sign uploads server-side (rather than
 * using an unsigned upload preset) so only logged-in admins can push images
 * to your Cloudinary account — an unsigned preset would let anyone who
 * inspects the frontend upload arbitrary files to your quota.
 */
export function signCloudinaryParams(params: Record<string, string | number>) {
  const sortedKeys = Object.keys(params).sort();
  const toSign = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");
  const signature = createHash("sha1")
    .update(toSign + process.env.CLOUDINARY_API_SECRET)
    .digest("hex");

  return signature;
}
