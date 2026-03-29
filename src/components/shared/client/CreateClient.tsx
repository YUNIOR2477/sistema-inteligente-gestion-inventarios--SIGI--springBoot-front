import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useClientStore } from "@/store/useClientStore";
import ToastMessage from "../ToastMessage";
import { useTheme } from "../Theme-provider";
import { Separator } from "@/components/ui/separator";
import { FilePen, FolderInput, XCircle } from "lucide-react";
import type { ApiError } from "@/types/Response";
import type { NewClient } from "@/types/Client";
import { InputWithClear } from "../InputWithClear";

const formFields: { key: keyof NewClient; label: string; type?: string }[] = [
  { key: "name", label: "Name" },
  { key: "identification", label: "Identification" },
  { key: "location", label: "Location" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email", type: "email" },
];

export const CreateClient = () => {
  const { handleCreateClient, isLoading } = useClientStore();
  const { theme } = useTheme();

  const [formData, setFormData] = useState<NewClient>({
    name: "",
    identification: "",
    location: "",
    phone: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleCreateClient(formData);
      if (response) {
        setFormData({
          name: "",
          identification: "",
          location: "",
          phone: "",
          email: "",
        });
        localStorage.setItem("createClientForm", "");
        ToastMessage({
          type: "success",
          title: response.message,
          description: `The new client has been saved in the database, and its ID: ${response.data.id} has been copied to the clipboard.`,
        });
        navigator.clipboard.writeText(response.data.id);
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
          Create Client
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Fill in the Client details below. Click save when you are done.
        </SheetDescription>
      </SheetHeader>
      <Separator />

      <div className="grid flex-1 auto-rows-min gap-5 px-4 py-2">
        {formFields.map((field) => (
          <div key={field.key} className="grid gap-1">
            <Label className="text-[13px]" htmlFor={field.key}>
              {field.label}
            </Label>

            <InputWithClear
              id={field.key}
              name={String(field.key)}
              type={field.type || "text"}
              placeholder={`Enter client ${field.label.toLowerCase()}`}
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
          <FilePen /> {isLoading ? "Saving..." : "Save Client"}
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
