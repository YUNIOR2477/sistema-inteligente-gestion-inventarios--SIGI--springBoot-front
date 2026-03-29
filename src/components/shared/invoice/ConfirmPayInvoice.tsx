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
import { CircleDollarSign, HandCoins } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";

interface RestoreProps {
  invoiceId: string;
  onPaying: () => void;
}

export const ConfirmPayInvoice = ({
  invoiceId,
  onPaying,
}: RestoreProps) => {
  const { handlePayInvoice, isLoading } = useInvoiceStore();
  const { theme } = useTheme();

  const [open, setOpen] = useState(false);

  const handleConfirmRestore = async () => {
    try {
      const response = await handlePayInvoice(invoiceId);
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message || "Invoice pay",
          description: `Invoice with ID ${invoiceId} has been pay successfully.`,
        });
        onPaying();
        setOpen(false);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      ToastMessage({
        type: "error",
        title: apiError.title,
        description: apiError.description,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
        variant={"ghost"}
          className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
        >
          <CircleDollarSign /> Pay Invoice
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-md ${
          theme === "system" ? "bg-gray-950" : "bg-background"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-green-500 flex gap-2 items-center">
            <CircleDollarSign /> Confirm Payment
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to pay this Invoice?
          </DialogDescription>
          <Separator/>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="cursor-pointer font-medium"
            disabled={isLoading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRestore}
            disabled={isLoading}
            variant={"ghost"}
            className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
          >
           <HandCoins/> {isLoading ? "Paying..." : "Yes, Pay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
