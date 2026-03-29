import { InvoiceTable } from "@/components/shared/invoice/InvoiceTable";
import { CardContent } from "@/components/ui/card";
import { FolderSearch } from "lucide-react";
import { useEffect } from "react";

export const SearchInvoicePage = () => {
    useEffect(() => {
        localStorage.setItem("navigationBar", "Search Invoices")
        localStorage.setItem("navigationTitle", "Invoices")
    }, [])

    return (
 <div className="py-8">
            <CardContent>
                <h2 className="text-2xl sm:text-3xl font-medium text-primary mb-4 flex items-center gap-2 justify-center">
                    <FolderSearch size={40}/> Search Invoices
                </h2>
                <InvoiceTable isDeleted={false} />
            </CardContent>
        </div>
    );
};
