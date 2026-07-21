"use client";

import { useRef, useState } from "react";
import styles from "./ImageUploader.module.css";

interface SignResponse {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
}

async function uploadOne(file: File): Promise<string> {
  const signRes = await fetch("/api/admin/cloudinary-sign", { method: "POST" });
  if (!signRes.ok) throw new Error("Could not get upload permission. Are you signed in?");
  const sign: SignResponse = await signRes.json();

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sign.apiKey);
  form.append("timestamp", String(sign.timestamp));
  form.append("signature", sign.signature);
  form.append("folder", sign.folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  if (!uploadRes.ok) {
    const body = await uploadRes.json().catch(() => null);
    throw new Error(body?.error?.message || "Upload failed");
  }

  const data = await uploadRes.json();
  return data.secure_url as string;
}

export default function ImageUploader({
  initialImages = [],
}: {
  initialImages?: string[];
}) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setUploading(true);

    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));

    try {
      const urls: string[] = [];
      for (const file of files) {
        // Uploaded one at a time to keep error messages attributable and
        // avoid overwhelming a slow rural connection with parallel uploads.
        const url = await uploadOne(file);
        urls.push(url);
      }
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  function makeCover(url: string) {
    setImages((prev) => [url, ...prev.filter((img) => img !== url)]);
  }

  return (
    <div>
      <input type="hidden" name="images" value={images.join("\n")} readOnly />

      <div
        className={styles.dropzone}
        data-dragover={dragOver}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.hiddenInput}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className={styles.dropText}>
          {uploading
            ? "Uploading..."
            : "Tap to choose photos, or drag them here"}
        </p>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {images.length > 0 && (
        <div className={styles.grid}>
          {images.map((url, i) => (
            <div key={url} className={styles.thumbWrap}>
              <img src={url} alt="" className={styles.thumb} />
              {i === 0 && <span className={styles.coverTag}>Cover</span>}
              <div className={styles.thumbActions}>
                {i !== 0 && (
                  <button
                    type="button"
                    className={styles.thumbButton}
                    onClick={() => makeCover(url)}
                  >
                    Make cover
                  </button>
                )}
                <button
                  type="button"
                  className={styles.thumbButtonDanger}
                  onClick={() => removeImage(url)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
