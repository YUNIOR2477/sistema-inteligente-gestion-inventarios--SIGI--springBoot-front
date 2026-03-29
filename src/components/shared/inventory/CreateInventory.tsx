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
import { useInventoryStore } from "@/store/useInventoryStore";
import type { NewInventory } from "@/types/Inventory";
import type { ApiError } from "@/types/Response";
import { FilePen, FolderInput, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useProductStore } from "@/store/useProductStore";
import type { Product } from "@/types/Product";
import { useWarehouseStore } from "@/store/useWarehouseStore";
import type { Warehouse } from "@/types/Warehouse";
import { InputWithClear } from "../InputWithClear";
import { SearchableFieldSingle } from "../SearchableField";

const formFields: { key: keyof NewInventory; label: string; type?: string }[] =
  [
    { key: "location", label: "Location" },
    { key: "lot", label: "Lot" },
    { key: "availableQuantity", label: "Available Quantity", type: "number" },
    { key: "reservedQuantity", label: "Reserved Quantity", type: "number" },
    { key: "productionDate", label: "Production Date", type: "date" },
    { key: "expirationDate", label: "Expiration Date", type: "date" },
  ];

interface Props {
  productId?: string;
}

export const CreateInventory = ({ productId }: Props) => {
  const { handleCreateInventory, isLoading } = useInventoryStore();
  const { fetchProductsByName } = useProductStore();
  const { fetchWarehousesByName } = useWarehouseStore();
  const { theme } = useTheme();

  const [formData, setFormData] = useState<NewInventory>({
    productId: productId || "",
    warehouseId: "",
    location: "",
    lot: "",
    productionDate: "",
    expirationDate: "",
    availableQuantity: "",
    reservedQuantity: "",
  });

  useEffect(() => {
    if (productId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ ...prev, productId }));
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleCreateInventory(formData);
      if (response) {
        setFormData({
          productId: "",
          warehouseId: "",
          location: "",
          lot: "",
          productionDate: "",
          expirationDate: "",
          availableQuantity: "",
          reservedQuantity: "",
        });
        localStorage.setItem("createInventoryForm", "");
        ToastMessage({
          type: "success",
          title: response.message,
          description: `The new inventory has been saved in the database, and its ID: ${response.data.id} has been copied to the clipboard.`,
        });
        navigator.clipboard.writeText(response.data.id);
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
          className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""
            }`}
        >
          <FolderInput />
          Create Inventory
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Fill in the inventory details below. Click save when you are done.
        </SheetDescription>
      </SheetHeader>
      <Separator />

      <div className="grid flex-1 auto-rows-min gap-3 px-4 py-2">
        {!productId && (
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
        )}

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

        {formFields.map((field) => (
          <div key={field.key} className="grid gap-1">
            <Label className="text-[13px]" htmlFor={field.key}>
              {field.label}
            </Label>

            <InputWithClear
              id={field.key}
              name={String(field.key)}
              type={field.type || "text"}
              placeholder={`Enter inventory ${field.label.toLowerCase()}`}
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
          className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
        >
          <FilePen /> {isLoading ? "Saving..." : "Save Inventory"}
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
