import { UserTable } from "@/components/shared/user/UserTable";
import { CardContent } from "@/components/ui/card";
import { FolderSearch } from "lucide-react";
import { useEffect } from "react";

export const SearchUserPage = () => {
    useEffect(() => {
        localStorage.setItem("navigationBar", "Search Users")
        localStorage.setItem("navigationTitle", "Users")
    }, [])

    return (
 <div className="py-8">
            <CardContent>
                <h2 className="text-2xl sm:text-3xl font-medium text-primary mb-4 flex items-center gap-2 justify-center">
                    <FolderSearch size={40}/> Search Users
                </h2>
                <UserTable isDeleted={false} />
            </CardContent>
        </div>
    );
};
