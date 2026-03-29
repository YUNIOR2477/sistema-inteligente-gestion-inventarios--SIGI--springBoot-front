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
import type { NewEntry } from "@/types/Inventory";
import type { ApiError } from "@/types/Response";
import { FilePen, FolderInput, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SearchableFieldSingle } from "../SearchableField";
import { useDispatcherStore } from "@/store/useDispatcherStore";
import type { Dispatcher } from "@/types/Dispatcher";
import { InputWithClear } from "../InputWithClear";

const formFields: { key: keyof NewEntry; label: string; type?: string }[] = [
  { key: "quantity", label: "quantity", type: "number" },
  { key: "motive", label: "motive" },
];

interface Props {
  inventoryId: string;
  onDone: () => void;
}

export const RegisterEntry = ({ inventoryId, onDone }: Props) => {
  const { handleRegisterEntry, isLoading } = useInventoryStore();
  const { fetchDispatchersByName } = useDispatcherStore();
  const { theme } = useTheme();

  const [formData, setFormData] = useState<NewEntry>({
    inventoryId: inventoryId,
    dispatcherId: "",
    quantity: "",
    motive: "",
  });

  useEffect(() => {
    localStorage.setItem("entryInventoryForm", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleRegisterEntry(formData);
      if (response) {
        setFormData({
          inventoryId: "",
          dispatcherId: "",
          quantity: "",
          motive: "",
        });
        onDone();
        localStorage.setItem("entryInventoryForm", "");
        ToastMessage({
          type: "success",
          title: response.message,
          description:
            "The new entry in to inventory has been saved in the database.",
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

  return (
    <form onSubmit={handleSubmit}>
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""}`}
        >
          <FolderInput />
          Create Inventory Entry
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Fill in the inventory entry details below. Click save when you are
          done.
        </SheetDescription>
      </SheetHeader>
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
        {formFields.map((field) => (
          <div key={field.key} className="grid gap-1">
            <Label className="text-[13px]" htmlFor={field.key}>
              {field.label}
            </Label>

            <InputWithClear
              id={field.key}
              name={String(field.key)}
              type={field.type || "text"}
              placeholder={`Enter inventory entry ${field.label.toLowerCase()}`}
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
          <FilePen /> {isLoading ? "Saving..." : "Save Inventory Entry"}
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
