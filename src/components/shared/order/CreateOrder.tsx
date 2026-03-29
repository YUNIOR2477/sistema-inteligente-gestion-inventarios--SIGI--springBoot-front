import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useOrderStore } from "@/store/useOrderStore";
import ToastMessage from "../ToastMessage";
import { useTheme } from "../Theme-provider";
import type { NewOrder } from "@/types/Order";
import { Separator } from "@/components/ui/separator";
import { FilePen, FolderInput, XCircle } from "lucide-react";
import type { ApiError } from "@/types/Response";
import { SearchableFieldSingle } from "../SearchableField";
import { useClientStore } from "@/store/useClientStore";
import { useWarehouseStore } from "@/store/useWarehouseStore";
import type { Client } from "@/types/Client";
import type { Warehouse } from "@/types/Warehouse";
import { useDispatcherStore } from "@/store/useDispatcherStore";
import type { Dispatcher } from "@/types/Dispatcher";

export const CreateOrder = () => {
  const { handleCreateOrder, isLoading } = useOrderStore();
  const { fetchClientsByName } = useClientStore();
  const { fetchWarehousesByName } = useWarehouseStore();
  const { fetchDispatchersByName } = useDispatcherStore();
  const { theme } = useTheme();

  const [formData, setFormData] = useState<NewOrder>({
    clientId: "",
    warehouseId: "",
    dispatcherId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleCreateOrder(formData);
      if (response) {
        setFormData({
          clientId: "",
          warehouseId: "",
          dispatcherId: "",
        });
        ToastMessage({
          type: "success",
          title: response.message,
          description: `The new order has been saved in the database, and its ID: ${response.data.id} has been copied to the clipboard.`,
        });
        navigator.clipboard.writeText(response.data.id);

        localStorage.setItem("createOrderForm", "");
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
          <FolderInput />
          Create Order
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Fill in the Order details below. Click save when you are done.
        </SheetDescription>
      </SheetHeader>
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
      </div>

      <SheetFooter>
        <Button
          type="submit"
          disabled={isLoading}
          variant={"ghost"}
          className={`cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80`}
        >
          <FilePen /> {isLoading ? "Saving..." : "Save Order"}
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
