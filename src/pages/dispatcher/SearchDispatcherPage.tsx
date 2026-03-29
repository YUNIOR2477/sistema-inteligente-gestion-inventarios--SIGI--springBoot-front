import { DispatcherTable } from "@/components/shared/dispatcher/DispatcherTable";
import { CardContent } from "@/components/ui/card";
import { FolderSearch } from "lucide-react";
import { useEffect } from "react";

export const SearchDispatcherPage = () => {
  useEffect(() => {
    localStorage.setItem("navigationBar", "Search inventories");
    localStorage.setItem("navigationTitle", "Inventories");
  }, []);

  return (
    <div className="py-8">
      <CardContent>
        <h2 className="text-2xl sm:text-3xl font-medium text-primary mb-4 flex items-center gap-2 justify-center">
          <FolderSearch size={40} /> Search dispatcher
        </h2>
        <DispatcherTable isDeleted={false} />
      </CardContent>
    </div>
  );
};
