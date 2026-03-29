import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ToastMessage from "../ToastMessage";
import { useTheme } from "../Theme-provider";
import { useOrderLineStore } from "@/store/useOrderLineStore";
import type { NewOrderLine } from "@/types/OrderLine";
import type { ApiError } from "@/types/Response";
import { useInventoryStore } from "@/store/useInventoryStore";
import { SearchableFieldSingle } from "../SearchableField";
import type { Inventory } from "@/types/Inventory";
import { useOrderStore } from "@/store/useOrderStore";
import type { Order } from "@/types/Order";
import { Separator } from "@/components/ui/separator";
import { XCircle } from "lucide-react";
import { InputWithClear } from "../InputWithClear";

const formFields: { key: keyof NewOrderLine; label: string; type?: string }[] =
  [{ key: "quantity", label: "Quantity" }];

const formInventoryFields: {
  key: keyof NewOrderLine;
  label: string;
  type?: string;
}[] = [{ key: "quantity", label: "Quantity" }];

interface Props {
  inventoryId?: string;
  orderId?: string;
  onDone?: () => void;
}

export const CreateOrderLine = ({ inventoryId, orderId, onDone }: Props) => {
  const { handleCreateOrderLine, isLoading } = useOrderLineStore();
  const { fetchInventoryBYId, fetchInventoriesBYProductName } =
    useInventoryStore();
  const { fetchOrdersByClientName } = useOrderStore();
  const { theme } = useTheme();

  const [formData, setFormData] = useState<NewOrderLine>({
    quantity: "",
    inventoryId: "",
    orderId: "",
  });

  useEffect(() => {
    const fetch = async () => {
      if (inventoryId) {
        const response = await fetchInventoryBYId(inventoryId);
        setFormData((prev) => ({
          ...prev,
          productId: response.data.product.id,
          inventoryId: response.data.id,
        }));
      }
      if (orderId) {
        setFormData((prev) => ({
          ...prev,
          orderId: orderId,
        }));
      }
    };
    fetch();
  }, [fetchInventoryBYId, inventoryId, orderId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData) {
        const response = await handleCreateOrderLine(
          formData.orderId,
          formData,
        );
        if (response) {
          setFormData((prev) => ({
            quantity: "",
            inventoryId: "",
            productId: "",
            orderId: orderId ?? prev.orderId ?? "",
          }));

          if (onDone) {
            onDone();
          }
          ToastMessage({
            type: "success",
            title: response.message,
            description: `The new order line has been saved in the database, and its ID: ${response.data.id} has been copied to the clipboard.`,
          });
          navigator.clipboard.writeText(response.data.id);
        }
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
    <form onSubmit={handleSubmit}>
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium ${theme === "system" ? "text-green-400" : ""}`}
        >
          Create Order Line
        </SheetTitle>
        <SheetDescription>
          Fill in the order line details below. Click save when you are done.
        </SheetDescription>
      </SheetHeader>
      <Separator />
      <div className="grid flex-1 auto-rows-min gap-5 px-4 py-2 ">
        {!orderId && (
          <SearchableFieldSingle
            label="Search available orders"
            name="orderId"
            type="client name"
            value={formData.orderId}
            onChange={(name, id) => {
              setFormData({ ...formData, [name]: id });
            }}
            searchFn={async (query) => {
              const res = await fetchOrdersByClientName({
                searchValue: query,
                page: 0,
                size: 50,
              });
              return (res?.data?.content ?? []).map((p: Order) => ({
                id: p.id,
                name: p.client.name,
              }));
            }}
            minChars={2}
          />
        )}

        {!inventoryId && (
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
        )}
      </div>
      <Separator />

      <div className="grid flex-1 auto-rows-min gap-5 px-4 py-2">
        {!inventoryId
          ? formFields.map((field) => (
              <div key={field.key} className="grid gap-1">
                <Label className="text-[13px]" htmlFor={field.key}>
                  {field.label}
                </Label>

                <InputWithClear
                  id={field.key}
                  name={String(field.key)}
                  type={field.type || "text"}
                  placeholder={`Enter order line ${field.label.toLowerCase()}`}
                  value={String(formData[field.key] ?? "")}
                  onChange={(e) => handleChange(e)}
                  onClear={() =>
                    setFormData((prev) => ({ ...prev, [field.key]: "" }))
                  }
                  required
                />
              </div>
            ))
          : formInventoryFields.map((field) => (
              <div key={field.key} className="grid gap-1">
                <Label className="text-[13px]" htmlFor={field.key}>
                  {field.label}
                </Label>

                <InputWithClear
                  id={field.key}
                  name={String(field.key)}
                  type={field.type || "text"}
                  placeholder={`Enter order line ${field.label.toLowerCase()}`}
                  value={String(formData[field.key] ?? "")}
                  onChange={(e) => handleChange(e)}
                  onClear={() =>
                    setFormData((prev) => ({ ...prev, [field.key]: "" }))
                  }
                  required
                />
              </div>
            ))}
      </div>

      <SheetFooter>
        <Button
          type="submit"
          disabled={isLoading}
          variant={"ghost"}
          className={`cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80`}
        >
          {isLoading ? "⏳ Saving..." : "Save Order Line"}
        </Button>
        <SheetClose asChild>
          <Button
            variant={"ghost"}
            className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80"
          >
            <XCircle /> Cancel
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
};
