import { OrderTable } from "@/components/shared/order/OrderTable";
import { CardContent } from "@/components/ui/card";
import { FolderSearch } from "lucide-react";
import { useEffect } from "react";

export const RestoreOrderPage = () => {
    useEffect(() => {
        localStorage.setItem("navigationBar", "Restore Orders")
        localStorage.setItem("navigationTitle", "Orders")
    }, [])

    return (
 <div className="py-8">
            <CardContent>
                <h2 className="text-2xl sm:text-3xl font-medium text-primary mb-4 flex items-center gap-2 justify-center">
                    <FolderSearch size={40}/> Look for Orders to restore
                </h2>
                <OrderTable isDeleted={true} />
            </CardContent>
        </div>
    );
};
