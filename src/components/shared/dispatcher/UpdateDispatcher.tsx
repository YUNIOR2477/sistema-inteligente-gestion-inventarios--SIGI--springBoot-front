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
import { useDispatcherStore } from "@/store/useDispatcherStore";
import { FilePen, FolderPen, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import type { NewDispatcher } from "@/types/Dispatcher";
import { InputWithClear } from "../InputWithClear";

interface UpdateProps {
  dispatcherId: string;
  onDone: () => void;
}

const formFields: {
  key: keyof NewDispatcher;
  label: string;
  type?: string;
}[] = [
  { key: "name", label: "Name" },
  { key: "identification", label: "Identification" },
  { key: "location", label: "Location" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email", type: "email" },
  { key: "contact", label: "Contact" },
];

export const UpdateDispatcher = ({ dispatcherId, onDone }: UpdateProps) => {
  const { fetchDispatcherById, handleUpdateDispatcher, isLoading } =
    useDispatcherStore();

  const { theme } = useTheme();

  const [formData, setFormData] = useState<NewDispatcher>({
    name: "",
    identification: "",
    location: "",
    phone: "",
    email: "",
    contact: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchDispatcherById(dispatcherId);
        if (response) {
          setFormData({
            name: response.data.name || "",
            identification: response.data.identification || "",
            location: response.data.location || "",
            phone: response.data.phone || "",
            email: response.data.email || "",
            contact: response.data.contact || "",
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
  }, [fetchDispatcherById, dispatcherId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleUpdateDispatcher(dispatcherId, formData);
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message,
          description:
            "The Dispatcher information has been updated successfully.",
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
          Update Dispatcher
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Modify the Dispatcher details below. Click save when you are done.
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
              placeholder={`Enter dispatcher ${field.label.toLowerCase()}`}
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
          <FilePen /> {isLoading ? "Updating..." : "Update Dispatcher"}
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
