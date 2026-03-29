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
import { Info, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import { useInventoryStore } from "@/store/useInventoryStore";
import type { Inventory } from "@/types/Inventory";
import generic from "@/assets/images/generic-product.png";

interface ViewProps {
  inventoryId: string;
  isDeleted: boolean;
  viewDeletedDetails?: boolean;
}

const entityFields: {
  key: string;
  label: string;
  accessor: (data: Inventory) => string;
}[] = [
  { key: "id", label: "Id", accessor: (data) => data.id },
  {
    key: "productId",
    label: "Product Id",
    accessor: (data) => data.product.id,
  },
  {
    key: "warehouseId",
    label: "Warehouse Id",
    accessor: (data) => data.warehouse.id,
  },
  { key: "location", label: "Location", accessor: (data) => data.location },
  { key: "lot", label: "Lot", accessor: (data) => data.lot },
  {
    key: "productionDate",
    label: "Production Date",
    accessor: (data) => data.productionDate,
  },
  {
    key: "expirationDate",
    label: "Expiration Date",
    accessor: (data) => data.expirationDate,
  },
  {
    key: "availableQuantity",
    label: "Available Quantity",
    accessor: (data) => data.availableQuantity,
  },
  {
    key: "reservedQuantity",
    label: "Reserved Quantity",
    accessor: (data) => data.reservedQuantity,
  },
  { key: "active", label: "Active", accessor: (data) => data.active },
  { key: "createdAt", label: "Created At", accessor: (data) => data.createdAt },
  { key: "createdBy", label: "Created By", accessor: (data) => data.createdBy },
  { key: "updatedAt", label: "Updated At", accessor: (data) => data.updatedAt },
  { key: "updatedBy", label: "Updated By", accessor: (data) => data.updatedBy },
  { key: "deletedAt", label: "Deleted At", accessor: (data) => data.deletedAt },
  { key: "deletedBy", label: "Deleted By", accessor: (data) => data.deletedBy },
];
export const ViewInventory = ({
  inventoryId,
  isDeleted,
  viewDeletedDetails,
}: ViewProps) => {
  const { fetchInventoryBYId, fetchDeletedInventoryBYId, isLoading } =
    useInventoryStore();

  const { theme } = useTheme();

  const [data, setData] = useState<Inventory | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response =
          isDeleted && viewDeletedDetails
            ? await fetchInventoryBYId(inventoryId)
            : isDeleted
              ? await fetchDeletedInventoryBYId(inventoryId)
              : await fetchInventoryBYId(inventoryId);
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
    inventoryId,
    isDeleted,
    fetchDeletedInventoryBYId,
    fetchInventoryBYId,
    viewDeletedDetails,
  ]);

  return (
    <div>
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""}`}
        >
          <Info />
          Inventory Details
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Below are the details of the selected inventory.
        </SheetDescription>
      </SheetHeader>
      <Separator />
      <div className="flex justify-center">
        {isLoading ? (
          <Skeleton className="h-32 w-32 rounded-md" />
        ) : (
          <img
            src={
              data?.product.imageUrl && data.product.imageUrl.trim() !== ""
                ? data.product.imageUrl
                : generic
            }
            alt={data?.product.name ?? "Generic product"}
            className="h-50 w-full object-cover rounded-md border"
          />
        )}
      </div>

      <div className="grid flex-1 auto-rows-min gap-4 px-4 py-2">
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
                value={
                  field.accessor(data) === null ? "" : field.accessor(data)
                }
                readOnly
              />
            </div>
          ))
        ) : (
          <p>No inventory data available.</p>
        )}
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button
            variant={"ghost"}
            className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80"
          >
            <XCircle /> Close
          </Button>
        </SheetClose>
      </SheetFooter>
    </div>
  );
};
