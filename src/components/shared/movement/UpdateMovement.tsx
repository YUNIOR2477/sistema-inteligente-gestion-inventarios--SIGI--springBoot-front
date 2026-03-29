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
import { FilePen, FolderPen, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import type { NewMovement } from "@/types/Movement";
import { useMovementStore } from "@/store/useMovementStore";
import { useDispatcherStore } from "@/store/useDispatcherStore";
import { SearchableFieldSingle } from "../SearchableField";
import type { Dispatcher } from "@/types/Dispatcher";
import { InputWithClear } from "../InputWithClear";
import { Input } from "@/components/ui/input";

interface UpdateProps {
  movementId: string;
  onDone: () => void;
}

const formFields: { key: keyof NewMovement; label: string; type?: string }[] = [
  { key: "type", label: "Type" },
  { key: "quantity", label: "Quantity", type: "number" },
  { key: "motive", label: "Motive" },
];

export const UpdateMovement = ({ movementId, onDone }: UpdateProps) => {
  const { fetchMovementById, handleUpdateMovement, isLoading } =
    useMovementStore();

  const { fetchDispatchersByName } = useDispatcherStore();
  const [dispatcherName, setDispatcherName] = useState("");

  const { theme } = useTheme();

  const [formData, setFormData] = useState<NewMovement>({
    type: "",
    inventoryId: "",
    productId: "",
    quantity: "",
    userId: "",
    orderId: "",
    dispatcherId: "",
    motive: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchMovementById(movementId);
        if (response) {
          setFormData({
            type: response.data.type || "",
            inventoryId: response.data.inventory.id || "",
            productId: response.data.product.id || "",
            quantity: response.data.quantity || "",
            userId: response.data.user.id || "",
            orderId: response.data.order.id || "",
            dispatcherId: response.data.dispatcher?.id || "",
            motive: response.data.motive || "",
          });
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
  }, [fetchMovementById, movementId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleUpdateMovement(movementId, formData);
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message,
          description:
            "The movement information has been updated successfully.",
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
          Update Movement
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Modify the movement details below. Click save when you are done.
        </SheetDescription>
      </SheetHeader>
      <Separator />
      <Separator />
      <div className="grid flex-1 auto-rows-min gap-5 px-4 py-2">
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
        <div>
          <div className="grid gap-1">
            <Label className="text-[13px]">Previous dispatcher name</Label>
            <Input value={dispatcherName} readOnly />
          </div>
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
              placeholder={`Enter movement ${field.label.toLowerCase()}`}
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
          <FilePen /> {isLoading ? "Updating..." : "Update Movement"}
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
