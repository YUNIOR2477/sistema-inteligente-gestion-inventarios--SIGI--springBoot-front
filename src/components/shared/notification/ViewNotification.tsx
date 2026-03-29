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
import { useNotificationStore } from "@/store/useNotificationStore";
import type { Notification } from "@/types/Notification";
import { Info, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/Response";

interface ViewProps {
  notificationId: string;
}

const entityFields: { key: keyof Notification; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "message", label: "Message" },
  { key: "isRead", label: "IsRead" },
  { key: "user", label: "Send At" },
  { key: "createdAt", label: "Created At" },
];

export const ViewNotification = ({ notificationId }: ViewProps) => {
  const { fetchNotificationById, isLoading } =
    useNotificationStore();

  const { theme } = useTheme();

  const [data, setData] = useState<Notification | null>(null);

  useEffect(() => {
    const fetchNotificationDetails = async () => {
      try {
        const response = await fetchNotificationById(notificationId);

        if (response) {
          setData(response.data);
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
    fetchNotificationDetails();
  }, [fetchNotificationById, notificationId]);

  return (
    <div>
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""}`}
        >
          <Info />
          Notification Details
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Below are the details of the selected Notification.
        </SheetDescription>
      </SheetHeader>
      <Separator />
      <div className="grid flex-1 auto-rows-min gap-4 px-4 py-2">
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
          <p>No Notification data available.</p>
        )}
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button
            variant={"ghost"}
            className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80"
          >
            <XCircle /> Close
          </Button>
        </SheetClose>
      </SheetFooter>
    </div>
  );
};
