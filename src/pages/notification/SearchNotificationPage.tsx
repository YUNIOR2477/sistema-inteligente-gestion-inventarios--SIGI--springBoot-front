import { NotificationTable } from "@/components/shared/notification/NotificationTable";
import { CardContent } from "@/components/ui/card";
import { FolderSearch } from "lucide-react";
import { useEffect } from "react";

export const SearchNotificationPage = () => {
    useEffect(() => {
        localStorage.setItem("navigationBar", "Search notifications")
        localStorage.setItem("navigationTitle", "notifications")
    }, [])

    return (
 <div className="py-8">
            <CardContent>
                <h2 className="text-2xl sm:text-3xl font-medium text-primary mb-4 flex items-center gap-2 justify-center">
                    <FolderSearch size={40}/> Search notifications
                </h2>
                <NotificationTable/>
            </CardContent>
        </div>
    );
};
