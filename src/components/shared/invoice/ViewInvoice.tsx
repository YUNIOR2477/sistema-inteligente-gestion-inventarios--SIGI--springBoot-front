import { useEffect, useState } from "react";
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
import { useInvoiceStore } from "@/store/useInvoiceStore";
import type { Invoice } from "@/types/Invoice";
import { Info, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import { useUserStore } from "@/store/useUserStore";
import { ConfirmPayInvoice } from "./ConfirmPayInvoice";
import { ConfirmCancelInvoice } from "./ConfirmCancelInvoice";
import { Button } from "@/components/ui/button";

interface ViewProps {
  invoiceId?: string;
  isDeleted: boolean;
  viewDeletedDetails?: boolean;
  orderId?: string;
}

const entityFields: {
  key: string;
  label: string;
  accessor: (data: Invoice) => string;
}[] = [
  { key: "id", label: "Id", accessor: (data) => data.id },
  { key: "number", label: "Number", accessor: (data) => data.number },
  { key: "orderId", label: "Order Id", accessor: (data) => data.order.id },
  { key: "client", label: "Client", accessor: (data) => data.client.name },
  { key: "subtotal", label: "Subtotal", accessor: (data) => data.subtotal },
  { key: "tax", label: "Tax", accessor: (data) => data.tax },
  { key: "total", label: "Total", accessor: (data) => data.total },
  { key: "status", label: "Status", accessor: (data) => data.status },
  { key: "active", label: "Active", accessor: (data) => data.active },
  { key: "createdAt", label: "Created At", accessor: (data) => data.createdAt },
  { key: "createdBy", label: "Created By", accessor: (data) => data.createdBy },
  { key: "updatedAt", label: "Updated At", accessor: (data) => data.updatedAt },
  { key: "updatedBy", label: "Updated By", accessor: (data) => data.updatedBy },
  { key: "deletedAt", label: "Deleted At", accessor: (data) => data.deletedAt },
  { key: "deletedBy", label: "Deleted By", accessor: (data) => data.deletedBy },
];
export const ViewInvoice = ({
  invoiceId,
  isDeleted,
  viewDeletedDetails,
  orderId,
}: ViewProps) => {
  const {
    fetchInvoiceById,
    fetchDeletedInvoiceById,
    fetchInvoiceByOrder,
    isLoading,
  } = useInvoiceStore();
  const { userProfileResponse } = useUserStore();
  const role = userProfileResponse?.data.role;
  const { theme } = useTheme();

  const [data, setData] = useState<Invoice | null>(null);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const response =
          isDeleted && viewDeletedDetails && invoiceId
            ? await fetchInvoiceById(invoiceId)
            : isDeleted && invoiceId
              ? await fetchDeletedInvoiceById(invoiceId)
              : orderId
                ? await fetchInvoiceByOrder(orderId)
                : invoiceId
                  ? await fetchInvoiceById(invoiceId)
                  : "";
        if (response) {
          setData(response.data);
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
    fetchInvoiceDetails();
  }, [
    fetchInvoiceById,
    invoiceId,
    isDeleted,
    fetchDeletedInvoiceById,
    viewDeletedDetails,
    orderId,
    fetchInvoiceByOrder,
  ]);

  return (
    <div>
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""}`}
        >
          <Info />
          Invoice Details
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Below are the details of the selected Invoice.
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
          <p>No Invoice data available.</p>
        )}
      </div>

      <SheetFooter>
        {data &&
        data.status === "ISSUED" &&
        (role === "ROLE_ADMIN" || role === "ROLE_SELLER") ? (
          <div className="flex flex-col gap-3">
            <ConfirmPayInvoice
              invoiceId={data?.id}
              onPaying={() => fetchInvoiceById(data?.id)}
            />

            <ConfirmCancelInvoice
              invoiceId={data?.id}
              onDone={() => fetchInvoiceById(data?.id)}
            />
          </div>
        ) : (
          <SheetClose asChild>
            <Button
              variant={"ghost"}
              className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80"
            >
              <XCircle /> Close
            </Button>
          </SheetClose>
        )}
      </SheetFooter>
    </div>
  );
};
