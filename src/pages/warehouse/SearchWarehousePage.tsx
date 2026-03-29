import { WarehouseTable } from "@/components/shared/warehouse/WarehouseTable";
import { CardContent } from "@/components/ui/card";
import { FolderSearch } from "lucide-react";
import { useEffect } from "react";

export const SearchWarehousePage = () => {
    useEffect(() => {
        localStorage.setItem("navigationBar", "Search warehouses")
        localStorage.setItem("navigationTitle", "Warehouses")
    }, [])

    return (
 <div className="py-8">
            <CardContent>
                <h2 className="text-2xl sm:text-3xl font-medium text-primary mb-4 flex items-center gap-2 justify-center">
                    <FolderSearch size={40}/> Search warehouses
                </h2>
                <WarehouseTable isDeleted={false} />
            </CardContent>
        </div>
    );
};
