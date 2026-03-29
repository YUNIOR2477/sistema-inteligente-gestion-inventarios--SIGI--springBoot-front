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
import { FolderSync, RefreshCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";

interface RestoreProps {
  invoiceId: string;
  isMobile?: boolean;
  onDone: () => void;
}

export const ConfirmRestoreInvoice = ({
  invoiceId,
  isMobile = false,
  onDone,
}: RestoreProps) => {
  const { handleRestoreInvoice, isLoading } = useInvoiceStore();
  const { theme } = useTheme();

  const [open, setOpen] = useState(false);

  const handleConfirmRestore = async () => {
    try {
      const response = await handleRestoreInvoice(invoiceId);
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message || "Invoice restored",
          description: `Invoice with ID ${invoiceId} has been restored successfully.`,
        });
        onDone();
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
          size="sm"
          variant={"ghost"}
          className="cursor-pointer font-medium text-primary bg-blue-500 hover:bg-blue-500/90"
        >
          <RefreshCcw /> {isMobile ? "" : "Restore"}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-md ${
          theme === "system" ? "bg-gray-950" : "bg-background"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-blue-500 flex gap-2 items-center">
            <FolderSync /> Confirm Restore
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to restore this Invoice?
          </DialogDescription>
          <Separator />
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
            className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
          >
            <FolderSync /> {isLoading ? "Restoring..." : "Yes, Restore"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
