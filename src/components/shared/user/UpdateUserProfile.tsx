import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ToastMessage from "../ToastMessage";
import { useTheme } from "../Theme-provider";
import { useUserStore } from "@/store/useUserStore";
import type { UpdateUser } from "@/types/User";
import { FilePen, FolderPen, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { InputWithClear } from "../InputWithClear";

interface UpdateProps {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const formFields: { key: keyof UpdateUser; label: string; type?: string }[] = [
  { key: "email", label: "Email", type: "email" },
  { key: "password", label: "Password", type: "password" },
  { key: "name", label: "Name" },
  { key: "surname", label: "Surname" },
  { key: "phoneNumber", label: "PhoneNumber" }
];

export const UpdateUserProfile = ({ open, onClose, onUpdated }: UpdateProps) => {
  const { userProfileResponse, handleUpdateUserProfile, isLoading } =
    useUserStore();

  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = userProfileResponse;
        if (response) {
          setFormData({
            email: response.data.email || "",
            password: "",
            name: response.data.name || "",
            surname: response.data.surname || "",
            phoneNumber: response.data.phoneNumber || ""
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
  }, [userProfileResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleUpdateUserProfile(formData);
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message,
          description: "The User information has been updated successfully.",
        });
        onClose();
        onUpdated()
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle
              className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""
                }`}
            >
              <FolderPen />
              Update User
            </DialogTitle>
            <DialogDescription className="justify-center flex">
              Modify the User details below. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
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
                          placeholder={`Enter user ${field.label.toLowerCase()}`}
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

          <DialogFooter className="mt-4 flex justify-between">
            <Button
              type="submit"
              disabled={isLoading}
              variant="ghost"
              className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
            >
              <FilePen /> {isLoading ? "Updating..." : "Update User"}
            </Button>

            <Button
              variant="ghost"
              className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80"
              onClick={onClose}
            >
              <XCircle /> Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};