import { UserTable } from "@/components/shared/user/UserTable";
import { CardContent } from "@/components/ui/card";
import { FolderSearch } from "lucide-react";
import { useEffect } from "react";

export const RestoreUserPage = () => {
    useEffect(() => {
        localStorage.setItem("navigationBar", "Restore Users")
        localStorage.setItem("navigationTitle", "Users")
    }, [])

    return (
 <div className="py-8">
            <CardContent>
                <h2 className="text-2xl sm:text-3xl font-medium text-primary mb-4 flex items-center gap-2 justify-center">
                    <FolderSearch size={40}/> Look for Users to restore
                </h2>
                <UserTable isDeleted={true} />
            </CardContent>
        </div>
    );
};
