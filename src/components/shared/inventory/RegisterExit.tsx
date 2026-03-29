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
import { useInventoryStore } from "@/store/useInventoryStore";
import { type ApiError } from "@/types/Response";
import { FilePen, FolderInput, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type {
  Inventory,
  NewExitDisposal,
  NewExitTransfer,
} from "@/types/Inventory";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SearchableFieldSingle } from "../SearchableField";
import { InputWithClear } from "../InputWithClear";

const formTransferFields: {
  key: keyof NewExitTransfer;
  label: string;
  type?: string;
}[] = [
  { key: "quantity", label: "Quantity", type: "number" },
  { key: "motive", label: "Motive" },
];

const formDisposalFields: {
  key: keyof NewExitDisposal;
  label: string;
  type?: string;
}[] = [
  { key: "quantity", label: "Quantity", type: "number" },
  { key: "motive", label: "Motive" },
];

interface Props {
  inventoryId: string;
  onDone: () => void;
}

export const RegisterExit = ({ inventoryId, onDone }: Props) => {
  const {
    handleRegisterExitDisposal,
    handleRegisterExitTransfer,
    fetchInventoryBYId,
    fetchInventoriesByProductSku,
    isLoading,
  } = useInventoryStore();
  const { theme } = useTheme();

  const [exitType, setExitType] = useState<"transfer" | "disposal">("transfer");

  const [formDataDisposal, setFormDataDisposal] = useState<NewExitDisposal>({
    inventoryId: inventoryId,
    quantity: "",
    motive: "",
  });

  const [inventory, setInventory] = useState<Inventory>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchInventoryBYId(inventoryId);
      if (response) setInventory(response.data);
    };
    fetchData();
  }, [fetchInventoryBYId, inventoryId]);

  const [formDataTransfer, setFormDataTransfer] = useState<NewExitTransfer>({
    originInventoryId: inventoryId,
    destinationInventoryId: "",
    quantity: "",
    motive: "",
  });

  const handleChangeTransfer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDataTransfer({
      ...formDataTransfer,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDisposal = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDataDisposal({
      ...formDataDisposal,
      [e.target.name]: e.target.value,
    });
  };

  const isTransferValid = () => {
    return (
      !!formDataTransfer.originInventoryId &&
      !!formDataTransfer.destinationInventoryId &&
      !!formDataTransfer.quantity &&
      Number(formDataTransfer.quantity) > 0
    );
  };

  const isDisposalValid = () => {
    return (
      !!formDataDisposal.inventoryId &&
      !!formDataDisposal.quantity &&
      Number(formDataDisposal.quantity) > 0
    );
  };

  const handleSubmitTransfer = async () => {
    try {
      const response = await handleRegisterExitTransfer(formDataTransfer);
      if (response) {
        setFormDataTransfer({
          originInventoryId: inventoryId,
          destinationInventoryId: "",
          quantity: "",
          motive: "",
        });
        onDone();
        ToastMessage({
          type: "success",
          title: response.message,
          description: "The new transfer exit has been saved in the database.",
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

  const handleSubmitDisposal = async () => {
    try {
      const response = await handleRegisterExitDisposal(formDataDisposal);
      if (response) {
        setFormDataDisposal({
          inventoryId: inventoryId,
          quantity: "",
          motive: "",
        });
        onDone();
        ToastMessage({
          type: "success",
          title: response.message,
          description: "The new disposal exit has been saved in the database.",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (exitType === "transfer") {
      if (!isTransferValid()) {
        ToastMessage({
          type: "error",
          title: "Validation",
          description: "Please fill required transfer fields.",
        });
        return;
      }
      await handleSubmitTransfer();
    } else {
      if (!isDisposalValid()) {
        ToastMessage({
          type: "error",
          title: "Validation",
          description: "Please fill required disposal fields.",
        });
        return;
      }
      await handleSubmitDisposal();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""}`}
        >
          <FolderInput />
          Create Inventory Exit
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Fill in the inventory exit details below. Click save when you are
          done.
        </SheetDescription>
      </SheetHeader>

      <Separator />

      <div className="grid gap-3 px-4 py-2">
        <Label className="text-[13px]">Exit type</Label>
        <Select
          value={exitType}
          onValueChange={(val) => setExitType(val as "transfer" | "disposal")}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transfer">Transfer</SelectItem>
            <SelectItem value="disposal">Disposal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 px-4 py-2">
        {exitType === "transfer" ? (
          <>
            <SearchableFieldSingle
              label="Search destination inventory"
              name="destinationInventoryId"
              type="warehouse name"
              value={formDataTransfer.destinationInventoryId}
              onChange={(name, id) => {
                setFormDataTransfer({ ...formDataTransfer, [name]: id });
              }}
              searchFn={async () => {
                const res = await fetchInventoriesByProductSku({
                  searchId: inventory?.id,
                  searchValue: inventory?.product.sku,
                  page: 0,
                  size: 50,
                });
                return (res?.data?.content ?? []).map((p: Inventory) => ({
                  id: p.id,
                  name: p.warehouse.name + " - " + p.product.name,
                }));
              }}
              minChars={2}
            />
            <Separator />
            {formTransferFields.map((field) => (
              <div key={field.key} className="grid gap-1">
                <Label className="text-[13px]" htmlFor={field.key}>
                  {field.label}
                </Label>

                <InputWithClear
                  id={field.key}
                  name={String(field.key)}
                  type={field.type || "text"}
                  placeholder={`Enter inventory transfer ${field.label.toLowerCase()}`}
                  value={String(formDataTransfer[field.key] ?? "")}
                  onChange={(e) => handleChangeTransfer(e)}
                  onClear={() =>
                    setFormDataTransfer((prev) => ({ ...prev, [field.key]: "" }))
                  }
                  required
                />
              </div>
            ))}
          </>
        ) : (
          <>
            {formDisposalFields.map((field) => (
              <div key={field.key} className="grid gap-1">
            <Label className="text-[13px]" htmlFor={field.key}>
              {field.label}
            </Label>

            <InputWithClear
              id={field.key}
              name={String(field.key)}
              type={field.type || "text"}
              placeholder={`Enter inventory exit disposal ${field.label.toLowerCase()}`}
              value={String(formDataDisposal[field.key] ?? "")}
              onChange={(e) => handleChangeDisposal(e)}
              onClear={() =>
                setFormDataDisposal((prev) => ({ ...prev, [field.key]: "" }))
              }
              required
            />
          </div>
            ))}
          </>
        )}
      </div>

      <SheetFooter>
        <Button
          type="submit"
          disabled={
            isLoading ||
            (exitType === "transfer" ? !isTransferValid() : !isDisposalValid())
          }
          variant={"ghost"}
          className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
        >
          <FilePen />{" "}
          {isLoading
            ? "Saving..."
            : exitType === "transfer"
              ? "Save Transfer"
              : "Save Disposal"}
        </Button>

        <SheetClose asChild>
          <Button
            variant={"ghost"}
            className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80"
          >
            <XCircle /> Cancel
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
};
