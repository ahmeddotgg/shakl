import { Upload } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  type FileUploadProps,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FormDescription } from "@/components/ui/form";

interface ImagesUploaderProps {
  max: number;
  multiable: boolean;
  onUpload: NonNullable<FileUploadProps["onUpload"]>;
  error?: any;
}

export function ImagesUploader({
  max,
  multiable,
  onUpload,
  error,
}: ImagesUploaderProps) {
  const [files, setFiles] = React.useState<File[]>([]);

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      onUpload={onUpload}
      maxFiles={max}
      onFileReject={onFileReject}
      className="flex-1"
      multiple={multiable}
      accept="image/*"
      maxSize={5 * 1024 * 1024}>
      <FileUploadDropzone className={cn(error && "border-destructive")}>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex justify-center items-center p-2.5 border rounded-full">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max {max} files)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file} className="flex-col">
            <div className="flex items-center gap-2 w-full">
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
            </div>
            <FileUploadItemProgress />
          </FileUploadItem>
        ))}
      </FileUploadList>
      <FormDescription className="relative">
        <span className="left-0 absolute opacity-0">
          This is your public display name
        </span>
        <span
          data-slot="form-message"
          className={cn(
            "left-0 absolute text-destructive text-sm min-[520px]:text-sm line-clamp-1"
          )}>
          {error}
        </span>
      </FormDescription>
    </FileUpload>
  );
}
