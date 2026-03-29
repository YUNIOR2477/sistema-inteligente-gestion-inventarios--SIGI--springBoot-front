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
import { useOrderStore } from "@/store/useOrderStore";
import type { Order } from "@/types/Order";
import { Info, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import { Card } from "@/components/ui/card";
import { UpdateOrderLineDialog } from "./UpdateOrderLine";

interface ViewProps {
  orderId: string;
  isDeleted: boolean;
  viewDeletedDetails?: boolean;
}

const entityFields: {
  key: string;
  label: string;
  accessor: (data: Order) => string;
}[] = [
  {
    key: "client",
    label: "Client Email",
    accessor: (data) => data.client.email,
  },
  { key: "user", label: "Seller email", accessor: (data) => data.user.email },
  {
    key: "warehouse",
    label: "Warehouse name",
    accessor: (data) => data.warehouse.name,
  },
  { key: "status", label: "Status", accessor: (data) => data.status },
  { key: "total", label: "Total", accessor: (data) => data.total },
  { key: "active", label: "Active", accessor: (data) => data.active },
  { key: "createdAt", label: "Created At", accessor: (data) => data.createdAt },
  { key: "createdBy", label: "Created By", accessor: (data) => data.createdBy },
  { key: "updatedAt", label: "Updated At", accessor: (data) => data.updatedAt },
  { key: "updatedBy", label: "Updated By", accessor: (data) => data.updatedBy },
  { key: "deletedAt", label: "Deleted At", accessor: (data) => data.deletedAt },
  { key: "deletedBy", label: "Deleted By", accessor: (data) => data.deletedBy },
];

export const ViewOrder = ({
  orderId,
  isDeleted,
  viewDeletedDetails,
}: ViewProps) => {
  const { fetchOrderById, fetchDeletedOrderById, isLoading } = useOrderStore();
  const { theme } = useTheme();
  const [data, setData] = useState<Order | null>(null);
  const [viewOrderLineOpen, setViewOrderLineOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response =
          isDeleted && viewDeletedDetails
            ? await fetchOrderById(orderId)
            : isDeleted
              ? await fetchDeletedOrderById(orderId)
              : await fetchOrderById(orderId);
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
    fetchOrderDetails();
  }, [
    fetchOrderById,
    orderId,
    isDeleted,
    fetchDeletedOrderById,
    viewDeletedDetails,
  ]);

  return (
    <div>
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium justify-center flex items-center gap-2 ${
            theme === "system" ? "text-green-400" : ""
          }`}
        >
          <Info />
          Order Details
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Below are the details of the selected Order.
        </SheetDescription>
      </SheetHeader>

      <Separator />
      <div className="grid flex-1 auto-rows-min gap-4 px-4 py-2">
        <div key={data?.id} className="grid gap-2">
          <Label className="text-[13px]" htmlFor={data?.id}>
            Order Id
          </Label>
         <Input id={data?.id} value={data?.id} readOnly />
        </div>
        {data?.lines?.length ? (
          <div>
            <Label className="text-[13px]" htmlFor={data?.id}>
              Order Line Details
            </Label>
            <div className="max-h-100 overflow-y-auto space-y-3 mt-2">
              {data.lines.map((item) => (
                <Card
                  key={item.id}
                  className="grid gap-2 border rounded-md p-3 bg-background/50"
                >
                  <Label className="text-[13px]">Order Line Id</Label>
                  <div className="flex items-center gap-2">
                   <Input value={item.id} readOnly />
                    <Button
                      variant="ghost"
                      className={`cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80 ${data.status!=="DRAFT"?"hidden":""}`}
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item.id);
                        setViewOrderLineOpen(true);
                      }}
                    >
                      Update
                    </Button>
                  </div>

                  <Label className="text-[13px]">Product Name</Label>
                 <Input value={item.inventory.product.name} readOnly />

                  <Label className="text-[13px]">Unit Price</Label>
                 <Input value={item.unitPrice} readOnly />

                  <Label className="text-[13px]">Quantity</Label>
                 <Input value={item.quantity} readOnly />

                  <Label className="text-[13px]">Subtotal</Label>
                 <Input
                    value={Number(item.quantity) * Number(item.unitPrice)}
                    readOnly
                  />
                </Card>
              ))}
            </div>
          </div>
        ) : null}
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
                value={field.accessor(data) ?? ""}
                readOnly
              />
            </div>
          ))
        ) : (
          <p>No Order data available.</p>
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

      {selectedItem && (
        <UpdateOrderLineDialog
          orderLineId={selectedItem}
          orderId={orderId}
          open={viewOrderLineOpen}
          onClose={() => setViewOrderLineOpen(false)}
          onUpdated={async () => {
            // refrescar datos de la orden
            try {
              const response =
                isDeleted && viewDeletedDetails
                  ? await fetchOrderById(orderId)
                  : isDeleted
                    ? await fetchDeletedOrderById(orderId)
                    : await fetchOrderById(orderId);
              if (response) setData(response.data);
            } catch (error: unknown) {
              const apiError = error as ApiError;
              ToastMessage({
                type: "error",
                title: apiError.title,
                description: apiError.description,
              });
            }
          }}
        />
      )}
    </div>
  );
};
