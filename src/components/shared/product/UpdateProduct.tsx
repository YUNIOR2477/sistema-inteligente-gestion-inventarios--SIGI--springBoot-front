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
import { useProductStore } from "@/store/useProductStore";
import type { NewProduct } from "@/types/Product";
import { FilePen, FolderPen, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import { Skeleton } from "@/components/ui/skeleton";
import generic from "@/assets/images/generic-product.png";
import { InputWithClear } from "../InputWithClear";

interface UpdateProps {
  productId: string;
  onDone: () => void;
}

const formFields: { key: keyof NewProduct; label: string; type?: string }[] = [
  { key: "sku", label: "Sku" },
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "unit", label: "Unit" },
  { key: "price", label: "Price", type: "number" },
  { key: "barcode", label: "Barcode" },
  { key: "imageUrl", label: "ImageUrl" },
];

export const UpdateProduct = ({ productId, onDone }: UpdateProps) => {
  const { fetchProductById, handleUpdateProduct, isLoading } =
    useProductStore();

  const { theme } = useTheme();

  const [formData, setFormData] = useState<NewProduct>({
    sku: "",
    name: "",
    category: "",
    unit: "",
    price: "",
    barcode: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchProductById(productId);
        if (response) {
          setFormData({
            sku: response.data.sku || "",
            name: response.data.name || "",
            category: response.data.category || "",
            unit: response.data.unit || "",
            price: response.data.price || "",
            barcode: response.data.barcode || "",
            imageUrl: response.data.imageUrl || "",
          });
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
  }, [fetchProductById, productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleUpdateProduct(productId, formData);
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message,
          description: "The product information has been updated successfully.",
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
          Update Product
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Modify the product details below. Click save when you are done.
        </SheetDescription>
      </SheetHeader>
      <Separator />
      <div className="grid flex-1 auto-rows-min gap-3 px-4 py-2">
        <div className="flex justify-center">
          {isLoading ? (
            <Skeleton className="h-32 w-32 rounded-md" />
          ) : (
            <img
              src={
                formData?.imageUrl && formData.imageUrl.trim() !== ""
                  ? formData.imageUrl
                  : generic
              }
              alt={formData?.name ?? "Generic product"}
              className="h-50 w-full object-cover rounded-md border"
            />
          )}
        </div>
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
          <FilePen /> {isLoading ? "Updating..." : "Update Product"}
        </Button>
        <SheetClose asChild>
          <Button variant={"ghost"}
            className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80">
            <XCircle />Cancel
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
};
