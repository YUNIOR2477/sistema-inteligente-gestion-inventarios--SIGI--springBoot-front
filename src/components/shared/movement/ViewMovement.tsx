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
import type { Movement } from "@/types/Movement";
import { useMovementStore } from "@/store/useMovementStore";

interface ViewProps {
  movementId: string;
  isDeleted: boolean;
  viewDeletedDetails?: boolean;
}

const entityFields: {
  key: string;
  label: string;
  accessor: (data: Movement) => string;
}[] = [
  { key: "id", label: "Id", accessor: (data) => data.id },
  { key: "type", label: "Type", accessor: (data) => data.type },
  { key: "inventoryId", label: "Inventory Id", accessor: (data) => data.inventory?.id ?? "" },
  { key: "productName", label: "Product Name", accessor: (data) => data.product?.name ?? "" },
  { key: "quantity", label: "Quantity", accessor: (data) => String(data.quantity) },
  { key: "userId", label: "User Id", accessor: (data) => data.user?.id ?? "" },
  { key: "order", label: "Order", accessor: (data) => data.order?.id ?? "" },
  { key: "dispatcher", label: "Dispatcher Email", accessor: (data) => data.dispatcher?.email ?? "" },
  { key: "motive", label: "Motive", accessor: (data) => data.motive ?? "" },
  { key: "active", label: "Active", accessor: (data) => String(data.active) },
  { key: "createdAt", label: "Created At", accessor: (data) => data.createdAt ?? "" },
  { key: "createdBy", label: "Created By", accessor: (data) => data.createdBy ?? "" },
  { key: "updatedAt", label: "Updated At", accessor: (data) => data.updatedAt ?? "" },
  { key: "updatedBy", label: "Updated By", accessor: (data) => data.updatedBy ?? "" },
  { key: "deletedAt", label: "Deleted At", accessor: (data) => data.deletedAt ?? "" },
  { key: "deletedBy", label: "Deleted By", accessor: (data) => data.deletedBy ?? "" },
];

export const ViewMovement = ({
  movementId,
  isDeleted,
  viewDeletedDetails,
}: ViewProps) => {
  const { fetchMovementById, fetchDeletedMovementById, isLoading } =
    useMovementStore();

  const { theme } = useTheme();

  const [data, setData] = useState<Movement | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response =
          isDeleted && viewDeletedDetails
            ? await fetchMovementById(movementId)
            : isDeleted
              ? await fetchDeletedMovementById(movementId)
              : await fetchMovementById(movementId);
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
    movementId,
    isDeleted,
    fetchDeletedMovementById,
    fetchMovementById,
    viewDeletedDetails,
  ]);

  return (
    <div>
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""}`}
        >
          <Info />
          Movement Details
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Below are the details of the selected movement.
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
                value={
                  field.accessor(data) === null ? "" : field.accessor(data)
                }
                readOnly
              />
            </div>
          ))
        ) : (
          <p>No movement data available.</p>
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
