import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ToastMessage from "../ToastMessage";
import { useTheme } from "../Theme-provider";
import { FilePen, XCircle } from "lucide-react";
import type { ApiError } from "@/types/Response";
import { useOrderLineStore } from "@/store/useOrderLineStore";
import type { NewOrderLine } from "@/types/OrderLine";
import { useInventoryStore } from "@/store/useInventoryStore";
import type { Inventory } from "@/types/Inventory";
import { Separator } from "@/components/ui/separator";
import { SearchableFieldSingle } from "../SearchableField";

interface UpdateOrderLineProps {
  orderLineId: string;
  orderId: string;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export const UpdateOrderLineDialog = ({
  orderLineId,
  orderId,
  open,
  onClose,
  onUpdated,
}: UpdateOrderLineProps) => {
  const { fetchOrderLineById, handleUpdateOrderLine, isLoading } =
    useOrderLineStore();
  const { theme } = useTheme();
  const { fetchInventoriesBYProductName } = useInventoryStore();
  const [inventoryName, setInventoryName] = useState("");
  const [formData, setFormData] = useState<NewOrderLine>({
    orderId,
    quantity: "",
    inventoryId: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchOrderLineById(orderLineId);
        if (response) {
          setFormData({
            orderId,
            quantity: response.data.quantity || "",
            inventoryId: response.data.inventory.id || "",
          });
          setInventoryName(response.data.inventory.product.name);
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
    if (open) fetchDetails();
  }, [fetchOrderLineById, orderLineId, orderId, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleUpdateOrderLine(orderLineId, formData);
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message,
          description: "The OrderLine has been updated successfully.",
        });
        onClose();
        onUpdated();
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle
              className={`text-xl font-medium flex items-center gap-2 ${
                theme === "system" ? "text-green-400" : ""
              }`}
            >
              <FilePen /> Update OrderLine
            </DialogTitle>
            <DialogDescription>
              Modify the OrderLine details below. Click save when you are done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className={`grid flex-1 auto-rows-min gap-5`}>
              <SearchableFieldSingle
                label="Search inventory"
                name="inventoryId"
                type="product name"
                value={formData.inventoryId}
                onChange={(name, id) => {
                  setFormData({ ...formData, [name]: id });
                }}
                searchFn={async (query) => {
                  const res = await fetchInventoriesBYProductName({
                    searchValue: query,
                    page: 0,
                    size: 50,
                  });
                  return (res?.data?.content ?? []).map((p: Inventory) => ({
                    id: p.id,
                    name: p.product.name,
                  }));
                }}
                minChars={2}
              />
              <div className="grid gap-1">
                <Label className="text-[13px]">Previous inventory name</Label>
                <Input value={inventoryName} readOnly />
              </div>
              <Separator />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              variant="ghost"
              className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
            >
              {isLoading ? "Updating..." : "Update OrderLine"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80"
              onClick={onClose}
            >
              <XCircle /> Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
