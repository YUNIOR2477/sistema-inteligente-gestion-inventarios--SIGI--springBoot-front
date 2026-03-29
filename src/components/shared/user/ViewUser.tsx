import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ToastMessage from "../ToastMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "../Theme-provider";
import { useUserStore } from "@/store/useUserStore";
import type { User } from "@/types/User";
import { Info, User2, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";
import { UpdateUserProfile } from "./UpdateUserProfile";

interface ViewProps {
  userId?: string;
  isDeleted: boolean;
  viewDeletedDetails?: boolean;
  userProfile?: boolean;
}

const entityFields: { key: keyof User; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "surname", label: "Surname" },
  { key: "phoneNumber", label: "Phone Number" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "active", label: "Active" },
  { key: "createdAt", label: "Created At" },
  { key: "createdBy", label: "Created By" },
  { key: "updatedAt", label: "Updated At" },
  { key: "updatedBy", label: "Updated By" },
  { key: "deletedAt", label: "Deleted At" },
  { key: "deletedBy", label: "Deleted By" },
];

export const ViewUser = ({
  userId,
  isDeleted,
  viewDeletedDetails,
  userProfile,
}: ViewProps) => {
  const {
    fetchUserById,
    fetchDeletedUserById,
    fetchCurrentUser,
    userProfileResponse,
    isLoading,
  } = useUserStore();

  const { theme } = useTheme();

  const [data, setData] = useState<User | null>(null);
  const [updateUserProfileOpen, setUpdateUserProfileOpen] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userProfile && userProfileResponse) {
        setData(userProfileResponse?.data);
      } else {
        try {
          const response =
            isDeleted && viewDeletedDetails && userId
              ? await fetchUserById(userId)
              : isDeleted && userId
                ? await fetchDeletedUserById(userId)
                : userId
                  ? await fetchUserById(userId)
                  : "";
          if (response) setData(response.data);
        } catch (error: unknown) {
          const apiError = error as ApiError;

          ToastMessage({
            type: "error",
            title: apiError.title,
            description: apiError.description,
          });
        }
      }
    };
    fetchUserDetails();
  }, [
    fetchUserById,
    userId,
    isDeleted,
    fetchDeletedUserById,
    viewDeletedDetails,
    userProfile,
    userProfileResponse,
  ]);

  return (
    <div>
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""}`}
        >
          <Info />
          {userProfile ? "User Profile" : "User Details"}
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          {userProfile
            ? "Below are the details of the user profile."
            : "Below are the details of the selected User."}
        </SheetDescription>
      </SheetHeader>
      <Separator />
      <div className="grid flex-1 auto-rows-min gap-4 px-4 py-2">
        <div className="flex gap-3">
          <Label htmlFor="id">Id</Label>
         <Input value={data?.id} readOnly />
          <Button
            variant={"ghost"}
            className={`cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80`}
            onClick={() => setUpdateUserProfileOpen(true)}
          >
            <User2 /> Update
          </Button>
        </div>
        {isLoading ? (
          entityFields.map((field) => (
            <Skeleton key={field.key} className="h-10 w-full" />
          ))
        ) : data ? (
          entityFields.map((field) => (
            <div key={field.key} className="grid gap-2">
              <Label className="text-[13px]" htmlFor={field.key}>
                {field.label}
              </Label>
             <Input
                id={field.key}
                value={data[field.key] === null ? "" : data[field.key]}
                readOnly
              />
            </div>
          ))
        ) : (
          <p>No User data available.</p>
        )}
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button
            variant={"ghost"}
            className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80"
          >
            <XCircle /> Close Close
          </Button>
        </SheetClose>
      </SheetFooter>
      <UpdateUserProfile
        open={updateUserProfileOpen}
        onClose={() => setUpdateUserProfileOpen(false)}
        onUpdated={async () => {
          try {
            await fetchCurrentUser();
          } catch (error: unknown) {
            const apiError = error as ApiError;
            ToastMessage({
              type: "error",
              title: apiError.title,
              description: apiError.description,
            });
          }
        }}
      />
    </div>
  );
};
