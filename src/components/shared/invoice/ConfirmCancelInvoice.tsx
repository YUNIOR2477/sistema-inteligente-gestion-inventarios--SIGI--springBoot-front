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
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { CircleX } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";

interface DeleteProps {
  invoiceId: string;
  onDone: () => void;
}

export const ConfirmCancelInvoice = ({ invoiceId, onDone }: DeleteProps) => {
  const { handleCancelInvoice, isLoading } = useInvoiceStore();
  const { theme } = useTheme();

  const [open, setOpen] = useState(false);

  const handleConfirmDelete = async () => {
    if (isLoading) return;

    try {
      const response = await handleCancelInvoice(invoiceId);
      ToastMessage({
        type: "success",
        title: response?.message || "Invoice canceled",
        description: `Invoice with ID ${invoiceId} has been canceled successfully.`,
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
         <CircleX/> Cancel Invoice
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-md ${
          theme === "system" ? "bg-gray-950" : "bg-background"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-red-500 flex gap-2 items-center">
            <CircleX /> Confirm Cancel
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this Invoice?
          </DialogDescription>
          <Separator/>
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
           <CircleX/> {isLoading ? "Canceled..." : "Yes, Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
