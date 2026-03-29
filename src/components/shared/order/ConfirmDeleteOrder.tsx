import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ToastMessage from "../ToastMessage";
import { useTheme } from "../Theme-provider";
import { useOrderStore } from "@/store/useOrderStore";
import { Trash, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";

interface DeleteProps {
  orderId: string;
  isMobile?: boolean;
  onDone: () => void;
}

export const ConfirmDeleteOrder = ({
  orderId,
  isMobile,
  onDone,
}: DeleteProps) => {
  const { handleDeleteOrder, isLoading } = useOrderStore();
  const { theme } = useTheme();

  const [open, setOpen] = useState(false);

  const handleConfirmDelete = async () => {
    if (isLoading) return;

    try {
      const response = await handleDeleteOrder(orderId);
      ToastMessage({
        type: "success",
        title: response?.message || "Order deleted",
        description: `Order with ID ${orderId} has been removed successfully.`,
      });
      onDone();
      setOpen(false);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      ToastMessage({
        type: "error",
        title: apiErr?.title,
        description: apiErr?.description,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={"ghost"}
          className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80"
        >
          <Trash /> {isMobile ? "" : "Delete"}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-md ${
          theme === "system" ? "bg-gray-950" : "bg-background"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-red-500 flex gap-2 items-center">
            <Trash2 /> Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this Order?
          </DialogDescription>
          <Separator />
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="font-medium cursor-pointer"
            disabled={isLoading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isLoading}
            variant={"ghost"}
            className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80"
          >
            <Trash2 /> {isLoading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
