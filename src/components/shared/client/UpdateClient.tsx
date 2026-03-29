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
import { useClientStore } from "@/store/useClientStore";
import { FilePen, FolderPen, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import type { NewClient } from "@/types/Client";
import { InputWithClear } from "../InputWithClear";

interface UpdateProps {
  clientId: string;
  onDone: () => void;
}

const formFields: { key: keyof NewClient; label: string; type?: string }[] = [
  { key: "name", label: "Name" },
  { key: "identification", label: "Identification" },
  { key: "location", label: "Location" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email", type: "email" },
];

export const UpdateClient = ({ clientId, onDone }: UpdateProps) => {
  const { fetchClientById, handleUpdateClient, isLoading } = useClientStore();

  const { theme } = useTheme();

  const [formData, setFormData] = useState<NewClient>({
    name: "",
    identification: "",
    location: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchClientById(clientId);
        if (response) {
          setFormData({
            name: response.data.name || "",
            identification: response.data.identification || "",
            location: response.data.location || "",
            phone: response.data.phone || "",
            email: response.data.email || "",
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
    fetchDetails();
  }, [fetchClientById, clientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleUpdateClient(clientId, formData);
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message,
          description: "The Client information has been updated successfully.",
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
          Update Client
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Modify the Client details below. Click save when you are done.
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
          <FilePen /> {isLoading ? "Updating..." : "Update Client"}
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
