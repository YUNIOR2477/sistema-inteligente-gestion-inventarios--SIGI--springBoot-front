import { ProductTable } from "@/components/shared/product/ProductTable";
import { CardContent } from "@/components/ui/card";
import { FolderSearch } from "lucide-react";
import { useEffect } from "react";

export const RestoreProductPage = () => {
    useEffect(() => {
        localStorage.setItem("navigationBar", "Restore products")
        localStorage.setItem("navigationTitle", "Products")
    }, [])

    return (
 <div className="py-8">
            <CardContent>
                <h2 className="text-2xl sm:text-3xl font-medium text-primary mb-4 flex items-center gap-2 justify-center">
                    <FolderSearch size={40}/> Look for products to restore
                </h2>
                <ProductTable isDeleted={true} />
            </CardContent>
        </div>
    );
};
