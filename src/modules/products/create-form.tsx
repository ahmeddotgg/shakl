import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import type { FileUploadProps } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import type { ProductInsert } from "~/supabase/index";
import { useUser } from "../auth/hooks/use-auth";
import {
  useCategories,
  useCreateProduct,
  useFileTypes,
} from "./hooks/use-products";
import { ImagesUploader } from "./images-uploader";
import { imageUpload } from "./services";

export const createProductSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title is too long" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(400, { message: "Description is too long" }),
  price: z.coerce
    .number<number>()
    .min(0)
    .nonnegative({ message: "Price cannot be negative" }),
  file_url: z.string().min(1, { message: "File is required" }),
  file_type_id: z.string().nonempty({ message: "Please choose a file type" }),
  category_id: z.string().nonempty({ message: "Please choose a category" }),
  thumbnail_url: z.string().min(1, { message: "Thumbnail is required" }),
  images: z
    .array(z.string().min(1))
    .min(1, { message: "Please upload at least one image" }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export function ProductForm() {
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { data: fileTypes = [], isLoading: fileTypesLoading } = useFileTypes();
  const { data: user } = useUser();
  const { mutate: createProduct, isPending, isError } = useCreateProduct();
  const [resetFiles, setResetFiles] = useState(false);
  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      file_url: "",
      file_type_id: "",
      category_id: "",
      thumbnail_url: "",
      images: [],
    },
  });

  const handleSubmit = (data: CreateProductInput) => {
    const newProduct: ProductInsert = {
      ...data,
      created_by: user?.id,
    };

    try {
      createProduct(newProduct);
      form.reset();
      setResetFiles(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Somthing went worng!";
      toast.error(errorMessage);
    }
  };

  const onThumbnailUpload: NonNullable<FileUploadProps["onUpload"]> =
    useCallback(
      async (files, { onProgress, onSuccess, onError }) => {
        try {
          const uploadPromises = files.map(async (file) => {
            try {
              onProgress(file, 20);
              const url = await imageUpload(file);
              if (!url) return toast.error("Error uploading!");

              onProgress(file, 100);
              onSuccess(file);

              if (thumbnailRef.current) {
                thumbnailRef.current.classList.add(
                  "pointer-events-none",
                  "opacity-50",
                );
                thumbnailRef.current.setAttribute("aria-disabled", "true");
              }

              form.setValue("thumbnail_url", url);
              toast.info("Thumbnail uploaded successfully 🎉");
            } catch (error) {
              onError(
                file,
                error instanceof Error ? error : new Error("Upload failed"),
              );
            }
          });

          await Promise.all(uploadPromises);
        } catch (error) {
          console.error("Unexpected error during upload:", error);
        }
      },
      [form.setValue],
    );

  const onImagesUpload: NonNullable<FileUploadProps["onUpload"]> = useCallback(
    async (files, { onProgress, onSuccess, onError }) => {
      try {
        const uploadPromises = files.map(async (file) => {
          try {
            onProgress(file, 20);

            const url = await imageUpload(file);
            if (!url) return toast.error("Error uploading!");

            onProgress(file, 100);
            onSuccess(file);

            const currentImages = form.getValues("images") || [];
            const updatedImages = [...currentImages, url];

            form.setValue("images", updatedImages, { shouldValidate: true });

            if (updatedImages.length >= 3 && imagesRef.current) {
              imagesRef.current.classList.add(
                "pointer-events-none",
                "opacity-50",
              );
              imagesRef.current.setAttribute("aria-disabled", "true");
            }

            toast.info(`Uploaded: ${file.name}`);
          } catch (error) {
            onError(
              file,
              error instanceof Error ? error : new Error("Upload failed"),
            );
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Unexpected error during upload:", error);
      }
    },
    [form],
  );

  const handleCategoryChange = (value: string) => {
    form.setValue("category_id", value);
  };

  const handleFileTypeChange = (value: string) => {
    form.setValue("file_type_id", value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-2 [&>*]:min-w-full">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product title" {...field} />
                </FormControl>
                <FormDescription className="relative">
                  <span className="absolute left-0 opacity-0">
                    This is your public display name
                  </span>
                  <FormMessage className="absolute left-0 line-clamp-1 text-xs min-[520px]:text-sm" />
                </FormDescription>
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
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    onFocus={(e) => e.target.select()}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription className="relative">
                  <span className="absolute left-0 opacity-0">
                    This is your public display name
                  </span>
                  <FormMessage className="absolute left-0 line-clamp-1 text-xs min-[520px]:text-sm" />
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your product..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription className="relative">
                <span className="absolute left-0 opacity-0">
                  This is your public display name
                </span>
                <FormMessage className="absolute left-0 line-clamp-1 text-xs min-[520px]:text-sm" />
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Download File URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/product-file.zip"
                  {...field}
                />
              </FormControl>
              <FormDescription className="relative">
                <span className="absolute left-0 opacity-0">
                  This is your public display name
                </span>
                <FormMessage className="absolute left-0 line-clamp-1 text-xs min-[520px]:text-sm" />
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-2 [&>*]:min-w-full">
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCategoryChange(value);
                    }}
                    value={field.value}
                    disabled={categoriesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          categoriesLoading
                            ? "Loading categories..."
                            : "Select category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                      {categoriesLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription className="relative">
                  <span className="absolute left-0 opacity-0">
                    This is your public display name
                  </span>
                  <FormMessage className="absolute left-0 line-clamp-1 text-xs min-[520px]:text-sm" />
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleFileTypeChange(value);
                    }}
                    value={field.value}
                    disabled={fileTypesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          fileTypesLoading ? "Loading Types..." : "Select Type"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {fileTypesLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        fileTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription className="relative">
                  <span className="absolute left-0 opacity-0">
                    This is your public display name
                  </span>
                  <FormMessage className="absolute left-0 line-clamp-1 text-xs min-[520px]:text-sm" />
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-2 min-[1050px]:flex-row">
          <div className="flex-1 space-y-2" ref={thumbnailRef}>
            <FormLabel>Thumbnail</FormLabel>
            <ImagesUploader
              error={form.formState.errors.thumbnail_url?.message}
              max={1}
              multiable={false}
              onUpload={onThumbnailUpload}
              reset={resetFiles}
            />
          </div>
          <div className="flex-1 space-y-2" ref={imagesRef}>
            <FormLabel>Images</FormLabel>
            <ImagesUploader
              error={form.formState.errors.images?.message}
              max={3}
              multiable
              onUpload={onImagesUpload}
              reset={resetFiles}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending && isError}
          size="lg"
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="size-5" />
              Create Product
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
