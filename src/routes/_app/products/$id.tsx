import ImageCarousel_Basic, {
  type CarouselImages,
} from "@/components/commerce-ui/image-carousel-basic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/modules/cart/hooks/use-cart";
import {
  getProductQueryOptions,
  useFileTypeById,
  useProductCategoryById,
} from "@/modules/products/hooks/use-products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Loader, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/_app/products/$id")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    try {
      return await queryClient.ensureQueryData(getProductQueryOptions(id));
    } catch (error) {
      throw redirect({ to: "/products/not-found" });
    }
  },
});

function RouteComponent() {
  const id = Route.useParams().id;
  const { data: product } = useSuspenseQuery(getProductQueryOptions(id));
  const { data: category, isPending: loadingCategory } = useProductCategoryById(
    product.category_id
  );
  const { data: fileType, isPending: loadingFileType } = useFileTypeById(
    product.file_type_id
  );

  const isMobile = useIsMobile();
  const { addItem: addToCart, items: cartItems } = useCart();

  const images: CarouselImages = product.images.map((url) => ({
    title: `${product.title}`,
    url,
  }));

  return (
    <div className="gap-8 lg:grid grid-cols-2 container">
      <ImageCarousel_Basic
        images={images}
        imageFit="contain"
        thumbPosition={isMobile ? "bottom" : "left"}
      />
      <div className="space-y-3">
        <h1 className="font-bold text-2xl">{product?.title}</h1>
        <p className="text-muted-foreground text-sm">{product.description}</p>
        <div className="flex gap-2 items-center">
          <Badge variant="secondary">
            {loadingCategory ? (
              <div className="px-6">
                <Loader className="size-[13px] animate-spin" />
              </div>
            ) : (
              category?.name
            )}
          </Badge>
          <Badge variant="secondary">
            {loadingFileType ? (
              <div className="px-6">
                <Loader className="size-[13px] animate-spin" />
              </div>
            ) : (
              fileType?.name
            )}
          </Badge>
        </div>
        <h2 className="font-bold text-primary text-3xl">
          {product.price === 0 ? "Free" : product.price}
        </h2>
        <Button
          onClick={() => addToCart(product)}
          disabled={cartItems.some((item) => item.id === product.id)}
          className="w-full"
          size="lg"
        >
          <ShoppingBag className="size-5" /> Add to cart
        </Button>
      </div>
    </div>
  );
}
