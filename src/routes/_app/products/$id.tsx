import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Loader, ShoppingBag } from "lucide-react";
import ImageCarousel_Basic, {
  type CarouselImages,
} from "@/components/shared/image-carousel-basic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/modules/cart/hooks/use-cart";
import { getProductQueryOptions } from "@/modules/products/hooks/use-products";

export const Route = createFileRoute("/_app/products/$id")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    try {
      return await queryClient.ensureQueryData(getProductQueryOptions(id));
    } catch (error) {
      console.log(error);
      throw redirect({ to: "/products/not-found" });
    }
  },
});

function RouteComponent() {
  const id = Route.useParams().id;
  const { data: product } = useSuspenseQuery(getProductQueryOptions(id));

  const isMobile = useIsMobile();
  const { addItem: addToCart, items: cartItems } = useCart();

  const images: CarouselImages = product.images.map((url) => ({
    title: `${product.title}`,
    url,
  }));

  return (
    <div className="container grid-cols-2 gap-8 lg:grid">
      <ImageCarousel_Basic
        images={images}
        imageFit="contain"
        thumbPosition={isMobile ? "bottom" : "left"}
      />
      <div className="space-y-3">
        <h1 className="font-bold text-2xl">{product?.title}</h1>
        <p className="text-muted-foreground text-sm">{product.description}</p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {!product ? (
              <div className="px-6">
                <Loader className="size-[13px] animate-spin" />
              </div>
            ) : (
              product.category
            )}
          </Badge>
          <Badge variant="secondary">
            {!product ? (
              <div className="px-6">
                <Loader className="size-[13px] animate-spin" />
              </div>
            ) : (
              product.file_type
            )}
          </Badge>
        </div>
        <h2 className="font-bold text-3xl text-primary">
          {product.price === 0 ? "Free" : `$${product.price.toFixed(2)}`}
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
