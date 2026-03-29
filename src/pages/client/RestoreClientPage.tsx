import { ClientTable } from "@/components/shared/client/ClientTable";
import { CardContent } from "@/components/ui/card";
import { FolderSearch } from "lucide-react";
import { useEffect } from "react";

export const RestoreClientPage = () => {
    useEffect(() => {
        localStorage.setItem("navigationBar", "Restore clients")
        localStorage.setItem("navigationTitle", "Clients")
    }, [])

    return (
 <div className="py-8">
            <CardContent>
                <h2 className="text-2xl sm:text-3xl font-medium text-primary mb-4 flex items-center gap-2 justify-center">
                    <FolderSearch size={40} /> Look for clients to restore
                </h2>
                <ClientTable isDeleted={true} />
            </CardContent>
        </div>
    );
};
