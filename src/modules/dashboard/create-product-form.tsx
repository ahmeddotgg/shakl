import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/lib/types";
import { useCategories } from "./hooks/use-categories";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  type FileUploadProps,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { uploadImageToSupabase } from "./services";
import { useCreateProduct } from "../products/hooks/use-products";
import { useSession } from "../auth/hooks/use-auth";
import type { ProductPayload } from "../products/services";

const fileTypes = [
  "pdf",
  "zip",
  "mp3",
  "mp4",
  "jpg",
  "png",
  "svg",
  "gif",
  "txt",
  "docx",
  "xlsx",
  "fig",
  "psd",
  "ai",
] as const;

type FileType = (typeof fileTypes)[number];

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const productFormSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  price: z.coerce.number<number>().min(1).positive(),
  thumbnail: z.string(),
  images: z.array(z.string()),
  file_type: z.enum(fileTypes),
  category: categorySchema, // full object
  file_url: z.string(),
});

export default function CreateProductForm() {
  const { data: categories } = useCategories();

  const { mutateAsync, isPending } = useCreateProduct();
  const { data: session } = useSession();
  const sellerId = session?.user?.id;

  const [thumbnail, setThumbnail] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);

  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      thumbnail: "",
      images: [],
      file_type: "pdf",
      category: undefined,
      file_url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    if (!sellerId) return;

    const payload: ProductPayload = {
      title: values.title,
      description: values.description,
      price: values.price,
      thumbnail: values.thumbnail,
      images: values.images,
      file_type: values.file_type as ProductPayload["file_type"],
      category_id: values.category?.id,
      seller_id: sellerId,
      file_url: values.file_url,
    };
    console.log(payload);

    try {
      toast.promise(mutateAsync(payload), {
        loading: "Uploading product...",
        success: "✅ Product uploaded successfully!",
        error: (err) =>
          `Failed to upload product: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
      });

      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
    }
  }
  console.log(form.formState.errors);

  const onUploadThumbnail: NonNullable<FileUploadProps["onUpload"]> =
    useCallback(async (files, { onProgress, onSuccess, onError }) => {
      if (files.length === 0) return;

      const file = files[0]; // Only one file
      try {
        onProgress(file, 20);
        const url = await uploadImageToSupabase(file);
        onProgress(file, 100);
        onSuccess(file);
        form.setValue("thumbnail", url); // ✅ single string
        setThumbnail(url); // Single URL
      } catch (error) {
        onError(
          file,
          error instanceof Error ? error : new Error("Upload failed")
        );
      }
    }, []);

  const onUploadImages: NonNullable<FileUploadProps["onUpload"]> = useCallback(
    async (files, { onProgress, onSuccess, onError }) => {
      try {
        const urls: string[] = [];

        const uploadPromises = files.map(async (file) => {
          try {
            onProgress(file, 20);
            const url = await uploadImageToSupabase(file);
            onProgress(file, 100);
            onSuccess(file);
            form.setValue("images", urls);
            setImages((prev) => [...prev, url]); // Add URL to array
          } catch (error) {
            onError(
              file,
              error instanceof Error ? error : new Error("Upload failed")
            );
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Unexpected error during upload:", error);
      }
    },
    []
  );

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:gap-x-4 lg:grid lg:grid-cols-2">
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="gap-2 grid grid-cols-2">
            <FormField
              control={form.control}
              name="file_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select file type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fileTypes.map((type, i) => (
                        <SelectItem key={i} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.id || ""}
                      onValueChange={(id) => {
                        const selected =
                          categories?.find((c) => c.id === id) || null;
                        field.onChange(selected);
                      }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Product Category">
                          {field.value?.name} {/* show selected name */}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem value={category.id} key={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="file_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Url</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
            {isPending ? "Creating..." : "Create Product"}
          </Button>
        </div>
        <div>
          <div className="gap-2 grid">
            <Label>Product Images</Label>
            <FileUpload
              value={imageFiles}
              onValueChange={setImageFiles}
              onUpload={onUploadImages}
              onFileReject={onFileReject}
              maxFiles={3}
              multiple
              className="w-full">
              <FileUploadDropzone>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex justify-center items-center p-2.5 border rounded-full">
                    <Upload className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm">Drag & drop files here</p>
                  <p className="text-muted-foreground text-xs">
                    Or click to browse (max 3 files)
                  </p>
                </div>
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2 w-fit">
                    Browse files
                  </Button>
                </FileUploadTrigger>
              </FileUploadDropzone>
              <FileUploadList>
                {imageFiles.map((file, index) => (
                  <FileUploadItem key={index} value={file} className="flex-col">
                    <div className="flex items-center gap-2 w-full">
                      <FileUploadItemPreview />
                      <FileUploadItemMetadata />
                      <FileUploadItemDelete asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <X />
                        </Button>
                      </FileUploadItemDelete>
                    </div>
                    <FileUploadItemProgress />
                  </FileUploadItem>
                ))}
              </FileUploadList>
            </FileUpload>
          </div>
          <div className="gap-2 grid">
            <Label>Product Thumbnail</Label>
            <FileUpload
              value={thumbnailFiles}
              onValueChange={setThumbnailFiles}
              onUpload={onUploadThumbnail}
              onFileReject={onFileReject}
              maxFiles={1}
              className="w-full">
              <FileUploadDropzone>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex justify-center items-center p-2.5 border rounded-full">
                    <Upload className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm">Drag & drop files here</p>
                  <p className="text-muted-foreground text-xs">
                    Or click to browse (max 2 files)
                  </p>
                </div>
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2 w-fit">
                    Browse files
                  </Button>
                </FileUploadTrigger>
              </FileUploadDropzone>
              <FileUploadList>
                {thumbnailFiles.map((file, index) => (
                  <FileUploadItem key={index} value={file} className="flex-col">
                    <div className="flex items-center gap-2 w-full">
                      <FileUploadItemPreview />
                      <FileUploadItemMetadata />
                      <FileUploadItemDelete asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <X />
                        </Button>
                      </FileUploadItemDelete>
                    </div>
                    <FileUploadItemProgress />
                  </FileUploadItem>
                ))}
              </FileUploadList>
            </FileUpload>
          </div>
        </div>
      </form>
    </Form>
  );
}
