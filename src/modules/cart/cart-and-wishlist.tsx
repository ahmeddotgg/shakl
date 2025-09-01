import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

export const CartAndWishlist = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"cart" | "wishlist">("cart");

  const openSheet = (tab: "cart" | "wishlist") => {
    setActiveTab(tab);
    setIsOpen(true);
  };

  const items = 0;

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => openSheet("cart")}>
        <ShoppingBag className="size-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => openSheet("wishlist")}>
        <Heart className="size-5" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle className="pb-4 border-b">
              {activeTab === "cart"
                ? `Your Cart (${items})`
                : `Your Wishlist (${items})`}
            </SheetTitle>

            <Tabs
              className="py-2"
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as "cart" | "wishlist")}
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="cart">Cart</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              </TabsList>

              <TabsContent value="cart">
                <div>Cart items go here</div>
              </TabsContent>
              <TabsContent value="wishlist">
                <div>Wishlist items go here</div>
              </TabsContent>
            </Tabs>
            <SheetDescription className="sr-only" />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};
