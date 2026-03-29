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
import { useWarehouseStore } from "@/store/useWarehouseStore";
import type { Warehouse } from "@/types/Warehouse";
import { Info, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";

interface ViewProps {
  warehouseId: string;
  isDeleted: boolean;
  viewDeletedDetails?: boolean;
}

const entityFields: { key: keyof Warehouse; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "location", label: "Location" },
  { key: "totalCapacity", label: "Total Capacity" },
  { key: "active", label: "Active" },
  { key: "createdAt", label: "Created At" },
  { key: "createdBy", label: "Created By" },
  { key: "updatedAt", label: "Updated At" },
  { key: "updatedBy", label: "Updated By" },
  { key: "deletedAt", label: "Deleted At" },
  { key: "deletedBy", label: "Deleted By" },
];

export const ViewWarehouse = ({
  warehouseId,
  isDeleted,
  viewDeletedDetails,
}: ViewProps) => {
  const { fetchWarehouseById, fetchDeletedWarehouseById, isLoading } =
    useWarehouseStore();

  const { theme } = useTheme();

  const [data, setData] = useState<Warehouse | null>(null);

  useEffect(() => {
    const fetchWarehouseDetails = async () => {
      try {
        const response =
          isDeleted && viewDeletedDetails
            ? await fetchWarehouseById(warehouseId)
            : isDeleted
              ? await fetchDeletedWarehouseById(warehouseId)
              : await fetchWarehouseById(warehouseId);
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
    fetchWarehouseDetails();
  }, [
    fetchWarehouseById,
    warehouseId,
    isDeleted,
    fetchDeletedWarehouseById,
    viewDeletedDetails,
  ]);

  return (
    <div>
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""}`}
        >
          <Info />
          Warehouse Details
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Below are the details of the selected warehouse.
        </SheetDescription>
      </SheetHeader>
      <Separator />
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
                value={data[field.key] === null ? "" : data[field.key]}
                readOnly
              />
            </div>
          ))
        ) : (
          <p>No warehouse data available.</p>
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
