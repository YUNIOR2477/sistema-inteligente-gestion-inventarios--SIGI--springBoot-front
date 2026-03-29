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
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { FilePen, FolderPen, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import type { NewInvoice } from "@/types/Invoice";
import { SearchableFieldSingle } from "../SearchableField";
import { useOrderStore } from "@/store/useOrderStore";
import type { Order } from "@/types/Order";
import { InputWithClear } from "../InputWithClear";
import { Input } from "@/components/ui/input";

interface UpdateProps {
  invoiceId: string;
  onDone: () => void;
}

const formFields: { key: keyof NewInvoice; label: string; type?: string }[] = [
  { key: "tax", label: "Tax" },
];

export const UpdateInvoice = ({ invoiceId, onDone }: UpdateProps) => {
  const { fetchInvoiceById, handleUpdateInvoice, isLoading } =
    useInvoiceStore();
  const { fetchOrdersByClientName } = useOrderStore();
  const { theme } = useTheme();
  const [formData, setFormData] = useState<NewInvoice>({
    orderId: "",
    tax: "",
  });
const [clientName, setClientName] = useState("")
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchInvoiceById(invoiceId);
        if (response) {
          setFormData({
            orderId: response.data.order.id || "",
            tax: response.data.tax || "",
          });
          setClientName(response.data.client.name)
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
  }, [fetchInvoiceById, invoiceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleUpdateInvoice(invoiceId, formData);
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message,
          description: "The Invoice information has been updated successfully.",
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
          Update Invoice
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Modify the Invoice details below. Click save when you are done.
        </SheetDescription>
      </SheetHeader>
      <Separator />
      <div className="grid flex-1 auto-rows-min gap-5 px-4 py-2">
        <SearchableFieldSingle
          label="Search order"
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
        <div className="grid gap-1">
                <Label className="text-[13px]">Previous order name</Label>
                <Input value={clientName} readOnly />
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
          className={`cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80`}
        >
          <FilePen /> {isLoading ? "Updating..." : "Update Invoice"}
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
