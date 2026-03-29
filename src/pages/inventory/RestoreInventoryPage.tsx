import { InventoryTable } from "@/components/shared/inventory/InventoryTable";
import { CardContent } from "@/components/ui/card";
import { FolderSearch } from "lucide-react";
import { useEffect } from "react";

export const RestoreInventoryPage = () => {
    useEffect(() => {
        localStorage.setItem("navigationBar", "Restore inventories")
        localStorage.setItem("navigationTitle", "Inventories")
    }, [])

    return (
 <div className="py-8">
            <CardContent>
                <h2 className="text-2xl sm:text-3xl font-medium text-primary mb-4 flex items-center gap-2 justify-center">
                    <FolderSearch size={40}/> Look for inventories to restore
                </h2>
                <InventoryTable isDeleted={true} />
            </CardContent>
        </div>
    );
};
