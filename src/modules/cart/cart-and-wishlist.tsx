import { Link, useRouter } from "@tanstack/react-router";
import {
  BrushCleaning,
  Heart,
  ShoppingBag,
  ShoppingBasket,
} from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateTotal } from "@/lib/utils";
import { useCart } from "./hooks/use-cart";
import { useWishlist } from "./hooks/use-wishlist";
import { Item } from "./item";

export const CartAndWishlist = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"cart" | "wishlist">("cart");
  const { items: cartItems, clearCart } = useCart();
  const { items: wishlistItems } = useWishlist();

  const openSheet = (tab: "cart" | "wishlist") => {
    setActiveTab(tab);
    setIsOpen(true);
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => openSheet("cart")}>
        <ShoppingBag className="size-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => openSheet("wishlist")}>
        <Heart className="size-5" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full min-[415px]:w-[400px]">
          <SheetHeader className="min-h-svh">
            <SheetTitle className="border-b pb-4">
              {activeTab === "cart"
                ? `Your Cart (${cartItems.length})`
                : `Your Wishlist (${wishlistItems.length})`}
            </SheetTitle>

            <ScrollArea className="h-[70vh] flex-1">
              <Tabs
                className="flex-1 px-1 py-2"
                value={activeTab}
                onValueChange={(val) =>
                  setActiveTab(val as "cart" | "wishlist")
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cart">Cart</TabsTrigger>
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                </TabsList>

                {/*______cart tap______*/}
                <TabsContent value="cart" className="space-y-3">
                  {cartItems.length > 0 ? (
                    <>
                      {cartItems.map((product) => (
                        <Item type="cart" key={product.id} product={product} />
                      ))}

                      <Button
                        size="sm"
                        variant="link"
                        className="text-muted-foreground text-xs"
                        onClick={clearCart}
                      >
                        <BrushCleaning />
                        Clear All
                      </Button>
                    </>
                  ) : (
                    <p className="mt-10 flex flex-col items-center justify-center gap-2 font-semibold text-lg text-muted-foreground">
                      <ShoppingBasket className="inline size-8" />
                      <span>Your cart is empty.</span>
                    </p>
                  )}
                </TabsContent>

                {/*______wishlist tap______*/}
                <TabsContent value="wishlist">
                  {wishlistItems.length > 0 ? (
                    wishlistItems.map((product) => (
                      <Item
                        type="wishlist"
                        key={product.id}
                        product={product}
                      />
                    ))
                  ) : (
                    <p className="mt-10 flex flex-col items-center justify-center gap-2 font-semibold text-lg text-muted-foreground">
                      <ShoppingBasket className="inline size-8" />
                      <span>Your wishlist is empty.</span>
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </ScrollArea>

            <SheetDescription className="sr-only" />
            {activeTab === "cart" && (
              <SheetFooter className="mt-0">
                {cartItems.length === 0 ? null : (
                  <>
                    <p className="flex items-center justify-between">
                      Cart Total:
                      <span className="font-semibold text-lg">
                        {calculateTotal(cartItems)}
                      </span>
                    </p>
                    <Link
                      to="/checkout"
                      className={buttonVariants()}
                      onClick={() =>
                        router.subscribe("onResolved", () => {
                          setIsOpen(false);
                        })
                      }
                      disabled={cartItems.length === 0}
                    >
                      Checkout
                    </Link>
                  </>
                )}
              </SheetFooter>
            )}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};
