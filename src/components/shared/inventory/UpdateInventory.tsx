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
import { FilePen, FolderPen, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import type { NewInventory } from "@/types/Inventory";
import { useInventoryStore } from "@/store/useInventoryStore";
import { SearchableFieldSingle } from "../SearchableField";
import { useWarehouseStore } from "@/store/useWarehouseStore";
import { useProductStore } from "@/store/useProductStore";
import type { Product } from "@/types/Product";
import type { Warehouse } from "@/types/Warehouse";
import { InputWithClear } from "../InputWithClear";
import { Input } from "@/components/ui/input";

interface UpdateProps {
  inventoryId: string;
  onDone: () => void;
}

const formFields: { key: keyof NewInventory; label: string; type?: string }[] =
  [
    { key: "location", label: "Location" },
    { key: "lot", label: "Lot" },
    { key: "productionDate", label: "Production Date", type: "date" },
    { key: "expirationDate", label: "Expiration Date", type: "date" },
    { key: "availableQuantity", label: "Available Quantity", type: "number" },
    { key: "reservedQuantity", label: "Reserved Quantity", type: "number" },
  ];

export const UpdateInventory = ({ inventoryId, onDone }: UpdateProps) => {
  const { fetchInventoryBYId, handleUpdateInventory, isLoading } =
    useInventoryStore();
  const { fetchWarehousesByName } = useWarehouseStore();
  const { fetchProductsByName } = useProductStore();
  const [warehouseName, setWarehouseName] = useState("");
  const [productName, setProductName] = useState("");

  const { theme } = useTheme();

  const [formData, setFormData] = useState<NewInventory>({
    productId: "",
    warehouseId: "",
    location: "",
    lot: "",
    productionDate: "",
    expirationDate: "",
    availableQuantity: "",
    reservedQuantity: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchInventoryBYId(inventoryId);
        if (response) {
          setFormData({
            productId: response.data.product.id || "",
            warehouseId: response.data.warehouse.id || "",
            location: response.data.location || "",
            lot: response.data.lot || "",
            productionDate: response.data.productionDate || "",
            expirationDate: response.data.expirationDate || "",
            availableQuantity: response.data.availableQuantity || "",
            reservedQuantity: response.data.reservedQuantity || "",
          });
          setProductName(response.data.product.name);
          setWarehouseName(response.data.warehouse.name);
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
    fetchDetails();
  }, [fetchInventoryBYId, inventoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleUpdateInventory(inventoryId, formData);
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message,
          description:
            "The inventory information has been updated successfully.",
        });
        onDone();
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
          className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""}`}
        >
          <FolderPen />
          Update Inventory
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Modify the inventory details below. Click save when you are done.
        </SheetDescription>
      </SheetHeader>
      <Separator />
      <div className="grid flex-1 auto-rows-min gap-5 px-4 py-2">
        <SearchableFieldSingle
          label="Search product"
          name="productId"
          type="name"
          value={formData.productId}
          onChange={(name, id) => {
            setFormData({ ...formData, [name]: id });
          }}
          searchFn={async (query) => {
            const res = await fetchProductsByName({
              searchValue: query,
              page: 0,
              size: 50,
            });
            return (res?.data?.content ?? []).map((p: Product) => ({
              id: p.id,
              name: p.name,
            }));
          }}
          minChars={2}
        />

        <SearchableFieldSingle
          label="Search warehouse"
          name="warehouseId"
          type="name"
          value={formData.warehouseId}
          onChange={(name, id) => {
            setFormData({ ...formData, [name]: id });
          }}
          searchFn={async (query) => {
            const res = await fetchWarehousesByName({
              searchValue: query,
              page: 0,
              size: 50,
            });
            return (res?.data?.content ?? []).map((p: Warehouse) => ({
              id: p.id,
              name: p.name,
            }));
          }}
          minChars={2}
        />
        <Separator />
        <div className="grid gap-1">
          <Label className="text-[13px]">Previous product name</Label>
          <Input value={productName} readOnly />
        </div>
        <div className="grid gap-1">
          <Label className="text-[13px]">Previous warehouse name</Label>
          <Input value={warehouseName} readOnly />
        </div>
        <Separator />

        {formFields.map((field) => (
          <div key={field.key} className="grid gap-1">
            <Label className="text-[13px]" htmlFor={field.key}>
              {field.label}
            </Label>

            <InputWithClear
              id={field.key}
              name={String(field.key)}
              type={field.type || "text"}
              placeholder={`Enter product ${field.label.toLowerCase()}`}
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
          <FilePen /> {isLoading ? "Updating..." : "Update Inventory"}
        </Button>
        <SheetClose asChild>
          <Button
            variant={"ghost"}
            className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80"
          >
            <XCircle />
            Cancel
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
};
