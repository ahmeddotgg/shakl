import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";
import React, { useState } from "react";

interface UploadProps {
  bucket: string;
  folder?: string;
  multiple?: boolean;
  onUploadComplete: (urls: string[]) => void;
}

export const Upload: React.FC<UploadProps> = ({
  bucket,
  folder = "",
  multiple = false,
  onUploadComplete,
}) => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const uploadFiles = async () => {
    if (!files.length) return;
    setUploading(true);

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const filePath = `${folder}/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error.message);
        continue;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      if (data.publicUrl) {
        uploadedUrls.push(data.publicUrl);
      }
    }

    setUrls(uploadedUrls);
    onUploadComplete(uploadedUrls);
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        multiple={multiple}
        onChange={handleFileChange}
        className="block w-full text-gray-500 text-sm"
      />
      <Button
        onClick={uploadFiles}
        disabled={uploading || !files.length}
        variant="secondary">
        {uploading ? "Uploading..." : "Upload"}
      </Button>

      {/* Preview uploaded images */}
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {urls.map((url) => (
            <img
              key={url}
              src={url}
              alt="uploaded"
              className="rounded w-20 h-20 object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Upload;
