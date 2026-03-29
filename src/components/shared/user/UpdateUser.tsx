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
import { useUserStore } from "@/store/useUserStore";
import type { NewUser } from "@/types/User";
import { FilePen, FolderPen, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputWithClear } from "../InputWithClear";

interface UpdateProps {
  userId: string;
  onDone: () => void;
}

const formFields: { key: keyof NewUser; label: string; type?: string }[] = [
  { key: "email", label: "Email", type: "email" },
  { key: "password", label: "Password", type: "password" },
  { key: "name", label: "Name" },
  { key: "surname", label: "Surname" },
  { key: "phoneNumber", label: "PhoneNumber" },
];

export const UpdateUser = ({ userId, onDone }: UpdateProps) => {
  const { fetchUserById, handleUpdateUser, isLoading } = useUserStore();

  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    phoneNumber: "",
    role: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchUserById(userId);
        if (response) {
          setFormData({
            email: response.data.email || "",
            password: "123456789",
            name: response.data.name || "",
            surname: response.data.surname || "",
            phoneNumber: response.data.phoneNumber || "",
            role: response.data.role || "",
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
  }, [fetchUserById, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleUpdateUser(userId, formData);
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message,
          description: "The User information has been updated successfully.",
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
          Update User
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Modify the User details below. Click save when you are done.
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
        <div className="grid gap-2">
          <Label className="text-[13px]" htmlFor="role">
            Role
          </Label>
          <Select
            value={formData.role}
            onValueChange={(val) => setFormData({ ...formData, role: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                <SelectItem value="ROLE_WAREHOUSE">Warehouse</SelectItem>
                <SelectItem value="ROLE_DISPATCHER">Dispatcher</SelectItem>
                <SelectItem value="ROLE_SELLER">Seller</SelectItem>
                <SelectItem value="ROLE_AUDITOR">Auditor</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SheetFooter>
        <Button
          type="submit"
          disabled={isLoading}
          variant={"ghost"}
          className={`cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80`}
        >
          <FilePen /> {isLoading ? "Updating..." : "Update User"}
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
