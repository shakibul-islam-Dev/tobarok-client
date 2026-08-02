"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, UploadCloud, X } from "lucide-react";
import SmartImage from "./SmartImage";
import { isAcceptedImage, uploadFile } from "@/lib/upload";

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
  previewClassName?: string;
  className?: string;
  hidePreview?: boolean;
}

/**
 * Drop-in image upload control backed by the backend upload service.
 * Shows a preview of the current value, an upload button, and a clear button.
 * The uploaded value is passed up as a relative "/uploads/…" path.
 */
export default function ImageUploader({
  value,
  onChange,
  label = "Upload image",
  hint = "JPG, PNG, WebP or SVG",
  previewClassName = "h-24 w-24",
  className,
  hidePreview = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!isAcceptedImage(file)) {
      setError(
        "Unsupported file type. Please use JPG, PNG, GIF, WebP, AVIF or SVG."
      );
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const result = await uploadFile(file);
      onChange(result.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        {!hidePreview && value && (
          <div
            className={`overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 ${previewClassName}`}
          >
            <SmartImage
              src={value}
              alt="Preview"
              width={160}
              height={160}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <UploadCloud size={14} />
              )}
              {uploading ? "Uploading…" : label}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setError(null);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-2.5 text-xs font-semibold uppercase tracking-widest text-neutral-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                <X size={13} />
                Remove
              </button>
            )}
          </div>

          {!value && (
            <span className="flex items-center gap-1.5 text-xs text-neutral-400">
              <ImagePlus size={13} />
              {hint}
            </span>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/avif,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
