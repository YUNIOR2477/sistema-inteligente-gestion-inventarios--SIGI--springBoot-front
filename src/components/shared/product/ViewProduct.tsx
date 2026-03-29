import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ToastMessage from "../ToastMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "../Theme-provider";
import { useProductStore } from "@/store/useProductStore";
import type { Product } from "@/types/Product";
import { Info, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import generic from "@/assets/images/generic-product.png";

interface ViewProps {
  productId: string;
  isDeleted: boolean;
  viewDeletedDetails?: boolean;
}

const entityFields: { key: keyof Product; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "sku", label: "Sku" },
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "unit", label: "Unit" },
  { key: "price", label: "Price" },
  { key: "barcode", label: "Barcode" },
  { key: "imageUrl", label: "Image Url" },
  { key: "active", label: "Active" },
  { key: "createdAt", label: "Created At" },
  { key: "createdBy", label: "Created By" },
  { key: "updatedAt", label: "Updated At" },
  { key: "updatedBy", label: "Updated By" },
  { key: "deletedAt", label: "Deleted At" },
  { key: "deletedBy", label: "Deleted By" },
];

export const ViewProduct = ({
  productId,
  isDeleted,
  viewDeletedDetails,
}: ViewProps) => {
  const { fetchProductById, fetchDeletedProductById, isLoading } =
    useProductStore();

  const { theme } = useTheme();

  const [data, setData] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response =
          isDeleted && viewDeletedDetails
            ? await fetchProductById(productId)
            : isDeleted
              ? await fetchDeletedProductById(productId)
              : await fetchProductById(productId);
        if (response) setData(response.data);
      } catch (error: unknown) {
        const apiError = error as ApiError;

        ToastMessage({
          type: "error",
          title: apiError.title,
          description: apiError.description,
        });
      }
    };
    fetchProductDetails();
  }, [
    fetchProductById,
    productId,
    isDeleted,
    fetchDeletedProductById,
    viewDeletedDetails,
  ]);

  return (
    <div>
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""}`}
        >
          <Info />
          Product Details
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Below are the details of the selected product.
        </SheetDescription>
      </SheetHeader>
      <Separator />
      <div className="grid flex-1 auto-rows-min gap-4 px-4 py-2">
        <div className="flex justify-center">
          {isLoading ? (
            <Skeleton className="h-32 w-32 rounded-md" />
          ) : (
            <img
              src={
                data?.imageUrl && data.imageUrl.trim() !== ""
                  ? data.imageUrl
                  : generic
              }
              alt={data?.name ?? "Generic product"}
              className="h-50 w-full object-cover rounded-md border"
            />
          )}
        </div>

        {isLoading ? (
          entityFields.map((field) => (
            <Skeleton key={field.key} className="h-10 w-full" />
          ))
        ) : data ? (
          entityFields.map((field) => (
            <div key={field.key} className="grid gap-2">
              <Label className="text-[13px]" htmlFor={field.key}>
                {field.label}
              </Label>
             <Input
                id={field.key}
                value={data[field.key] === null ? "" : data[field.key]}
                readOnly
              />
            </div>
          ))
        ) : (
          <p>No product data available.</p>
        )}
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant={"ghost"}
            className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80">
                <XCircle /> Close
          </Button>
        </SheetClose>
      </SheetFooter>
    </div>
  );
};
