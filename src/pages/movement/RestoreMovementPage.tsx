import { MovementTable } from "@/components/shared/movement/MovementTable";
import { CardContent } from "@/components/ui/card";
import { FolderSearch } from "lucide-react";
import { useEffect } from "react";

export const RestoreMovementPage = () => {
    useEffect(() => {
        localStorage.setItem("navigationBar", "Restore movements")
        localStorage.setItem("navigationTitle", "Movements")
    }, [])

    return (
 <div className="py-8">
            <CardContent>
                <h2 className="text-2xl sm:text-3xl font-medium text-primary mb-4 flex items-center gap-2 justify-center">
                    <FolderSearch size={40}/> Look for movements to restore
                </h2>
                <MovementTable isDeleted={true} />
            </CardContent>
        </div>
    );
};
