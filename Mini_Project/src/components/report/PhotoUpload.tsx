import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ImagePlus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Downscale + compress an image in the browser before upload. */
export async function compressImage(file: File, maxSize = 1280, quality = 0.72): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(file);
  });

  const img = new Image();
  img.src = dataUrl;
  await img.decode().catch(() => undefined);
  if (!img.width) return dataUrl;

  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

export function PhotoUpload({
  preview,
  onChange,
}: {
  preview: string | null;
  onChange: (file: File | null, preview: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleFile(file?: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    const compressed = await compressImage(file);
    onChange(file, compressed);
    setBusy(false);
  }

  if (preview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="overflow-hidden rounded-2xl border border-border bg-surface"
      >
        <img src={preview} alt="Reported issue preview" className="max-h-72 w-full object-cover" />
        <div className="flex items-center justify-between gap-3 p-3">
          <p className="text-xs text-muted-foreground">Image compressed and ready to upload.</p>
          <Button variant="ghost" size="sm" onClick={() => onChange(null, null)}>
            <Trash2 className="size-4" /> Remove
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void handleFile(e.dataTransfer.files?.[0]);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface px-6 py-14 text-center transition-colors",
        dragging && "border-primary bg-accent",
      )}
    >
      <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-accent">
        <ImagePlus className="size-5 text-primary" />
      </div>
      <p className="text-sm font-semibold">{busy ? "Compressing…" : "Drag & drop a photo here"}</p>
      <p className="mt-1 text-xs text-muted-foreground">or tap to take/choose a picture · JPG, PNG</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
