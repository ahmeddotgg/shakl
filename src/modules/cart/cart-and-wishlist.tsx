import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BrushCleaning,
  Heart,
  ShoppingBag,
  ShoppingBasket,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "./hooks/use-cart";
import { Item } from "./item";
import { useWishlist } from "./hooks/use-wishlist";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CartAndWishlist = () => {
  const [isOpen, setIsOpen] = useState(false);
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
            <SheetTitle className="pb-4 border-b">
              {activeTab === "cart"
                ? `Your Cart (${cartItems.length})`
                : `Your Wishlist (${cartItems.length})`}
            </SheetTitle>

            <ScrollArea className="flex-1 h-[70vh]">
              <Tabs
                className="flex-1 py-2"
                value={activeTab}
                onValueChange={(val) =>
                  setActiveTab(val as "cart" | "wishlist")
                }>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="cart">Cart</TabsTrigger>
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                </TabsList>

                {/*______cart tap______*/}
                <TabsContent value="cart" className="space-y-3">
                  {cartItems.length > 0 ? (
                    <>
                      {cartItems.map((product) => (
                        <Item key={product.id} product={product} />
                      ))}

                      <Button
                        size="sm"
                        variant="link"
                        className="text-muted-foreground text-xs"
                        onClick={clearCart}>
                        <BrushCleaning />
                        Clear All
                      </Button>
                    </>
                  ) : (
                    <p className="flex flex-col justify-center items-center gap-2 mt-10 font-semibold text-muted-foreground text-lg">
                      <ShoppingBasket className="inline size-8" />
                      <span>Your cart is empty.</span>
                    </p>
                  )}
                </TabsContent>

                {/*______wishlist tap______*/}
                <TabsContent value="wishlist">
                  {wishlistItems.length > 0 ? (
                    wishlistItems.map((product) => (
                      <Item key={product.id} product={product} />
                    ))
                  ) : (
                    <p className="flex flex-col justify-center items-center gap-2 mt-10 font-semibold text-muted-foreground text-lg">
                      <ShoppingBasket className="inline size-8" />
                      <span>Your wishlist is empty.</span>
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </ScrollArea>

            <SheetDescription className="sr-only" />
            <SheetFooter className="mt-0">heyy</SheetFooter>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};
