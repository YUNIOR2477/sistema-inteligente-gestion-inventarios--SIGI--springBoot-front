import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ToastMessage from "../ToastMessage";
import { useTheme } from "../Theme-provider";
import { useOrderStore } from "@/store/useOrderStore";
import { FilePen, FolderPen, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import type { NewOrder } from "@/types/Order";
import { SearchableFieldSingle } from "../SearchableField";
import { useClientStore } from "@/store/useClientStore";
import { useWarehouseStore } from "@/store/useWarehouseStore";
import type { Client } from "@/types/Client";
import type { Warehouse } from "@/types/Warehouse";
import { useDispatcherStore } from "@/store/useDispatcherStore";
import type { Dispatcher } from "@/types/Dispatcher";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface UpdateProps {
  orderId: string;
  onDone: () => void;
}

export const UpdateOrder = ({ orderId, onDone }: UpdateProps) => {
  const { fetchOrderById, handleUpdateOrder, isLoading } = useOrderStore();
  const { fetchClientsByName } = useClientStore();
  const { fetchWarehousesByName } = useWarehouseStore();
  const { fetchDispatchersByName } = useDispatcherStore();
  const [clientName, setClientName] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [dispatcherName, setDispatcherName] = useState("");
  const { theme } = useTheme();

  const [formData, setFormData] = useState<NewOrder>({
    clientId: "",
    warehouseId: "",
    dispatcherId: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchOrderById(orderId);
        if (response) {
          setFormData({
            clientId: response.data.client.id || "",
            warehouseId: response.data.warehouse.id || "",
            dispatcherId: response.data.dispatcher.id || "",
          });
          setClientName(response.data.client.name);
          setWarehouseName(response.data.warehouse.name);
          setDispatcherName(response.data.dispatcher.name);
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
  }, [fetchOrderById, orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleUpdateOrder(orderId, formData);
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message,
          description: "The Order information has been updated successfully.",
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
          Update Order
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Modify the Order details below. Click save when you are done.
        </SheetDescription>
      </SheetHeader>
      <Separator />
      <Separator />
      <div className="grid flex-1 auto-rows-min gap-5 px-4 py-2">
        <SearchableFieldSingle
          label="Search client"
          name="clientId"
          type="name"
          value={formData.clientId}
          onChange={(name, id) => {
            setFormData({ ...formData, [name]: id });
          }}
          searchFn={async (query) => {
            const res = await fetchClientsByName({
              searchValue: query,
              page: 0,
              size: 50,
            });
            return (res?.data?.content ?? []).map((p: Client) => ({
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
        <SearchableFieldSingle
          label="Search dispatcher"
          name="dispatcherId"
          type="name"
          value={formData.dispatcherId}
          onChange={(name, id) => {
            setFormData({ ...formData, [name]: id });
          }}
          searchFn={async (query) => {
            const res = await fetchDispatchersByName({
              searchValue: query,
              page: 0,
              size: 50,
            });
            return (res?.data?.content ?? []).map((p: Dispatcher) => ({
              id: p.id,
              name: p.name,
            }));
          }}
          minChars={2}
        />
        <Separator />

        <div className="grid gap-1">
          <Label className="text-[13px]">Previous client name</Label>
          <Input value={clientName} readOnly />
        </div>
        <div className="grid gap-1">
          <Label className="text-[13px]">Previous warehouse name</Label>
          <Input value={warehouseName} readOnly />
        </div>
        <div className="grid gap-1">
          <Label className="text-[13px]">Previous dispatcher name</Label>
          <Input value={dispatcherName} readOnly />
        </div>
      </div>

      <SheetFooter>
        <Button
          type="submit"
          disabled={isLoading}
          variant={"ghost"}
          className={`cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80`}
        >
          <FilePen /> {isLoading ? "Updating..." : "Update Order"}
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
