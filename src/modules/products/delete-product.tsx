import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUser } from "../auth/hooks/use-auth";
import { useDeleteProduct } from "./hooks/use-products";

export const DeleteProduct = ({ productId }: { productId: string }) => {
  const { data: user } = useUser();
  const { mutate, isPending } = useDeleteProduct();
  const queryClient = useQueryClient();

  async function handleDelete(productId: string) {
    try {
      mutate(
        { userId: user?.id as string, productId },
        {
          onSuccess: () => {
            toast.success("Product deleted");
            queryClient.invalidateQueries({ queryKey: ["products"] });
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the product
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => handleDelete(productId)}
          disabled={isPending}
        >
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
      <AlertDialogDescription className="sr-only">
        Delete Product
      </AlertDialogDescription>
    </AlertDialogContent>
  );
};
