import { useEffect, useState } from "react";
import { useTheme } from "../Theme-provider";
import ToastMessage from "../ToastMessage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViewWarehouse } from "./ViewWarehouse";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { UpdateWarehouse } from "./UpdateWarehouse";
import { ConfirmDeleteWarehouse } from "./ConfirmDeleteWarehouse";
import { useUserStore } from "@/store/useUserStore";
import type { ApiError, ApiResponse, ApiResponsePaginated } from "@/types/Response";
import { ConfirmRestoreWarehouse } from "./ConfirmRestoreWarehouse";
import { useWarehouseStore } from "@/store/useWarehouseStore";
import type { Warehouse } from "@/types/Warehouse";
import { Copy, Eye, NotebookPen } from "lucide-react";
import { sortDirections } from "@/types/Request";
import { TableToolbar } from "../TableToolBar";
import { TablePagination } from "../TablePaginationFooter";
import { Separator } from "@/components/ui/separator";

const filterList = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
  { value: "name", label: "Name" },
  { value: "capacity", label: "Capacity" },
];

const filterListDeleted = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
  { value: "name", label: "Name" },
];

const sizeOptions = [5, 10, 20, 50];

const sortFields = [
  { value: "name", label: "Name" },
  { value: "location", label: "Location" },
  { value: "totalCapacity", label: "Total Capacity" },
  { value: "createdAt", label: "Created At" },
];

interface TableProps {
  isDeleted: boolean;
}

export const WarehouseTable = ({ isDeleted }: TableProps) => {
  const {
    fetchAllWarehouses,
    fetchAllDeletedWarehouses,
    fetchWarehouseById,
    fetchWarehousesByCapacity,
    fetchWarehousesByName,
    fetchDeletedWarehousesByName,
    fetchDeletedWarehouseById,
    isLoading,
  } = useWarehouseStore();

  const { userProfileResponse } = useUserStore();
  const [dataList, setDataList] = useState<Warehouse[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [sizeHidden, setSizeHidden] = useState(false);
  const { theme } = useTheme();
  const [viewOpen, setViewOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const role = userProfileResponse?.data.role;

  useEffect(() => {
    fetchData(0, size, sortField, sortDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, sortField, sortDirection]);

  const applyPaginatedResponse = (
    response: ApiResponsePaginated<Warehouse> | null,
  ) => {
    if (response) {
      const { content, totalPages, totalElements } = response.data;
      setDataList(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setSizeHidden(false);
    }
  };

  const applyCurrentResponse = (response: ApiResponse<Warehouse> | null) => {
    if (response) {
      setDataList([response.data]);
      setTotalPages(1);
      setTotalElements(1);
      setSizeHidden(true);
    }
  };

  const fetchData = async (
    pageNumber: number,
    pageSize: number,
    sortFieldParam?: string,
    sortDirectionParam?: string,
  ) => {
    try {
      const q = (searchInput || "").trim();
      if (filter === "all" || (filter !== "all" && !q)) {
        const response = isDeleted
          ? await fetchAllDeletedWarehouses({
              page: pageNumber,
              size: pageSize,
              sortDirection: sortDirectionParam,
              sortField: sortFieldParam,
            })
          : await fetchAllWarehouses({
              page: pageNumber,
              size: pageSize,
              sortDirection: sortDirectionParam,
              sortField: sortFieldParam,
            });
        setSearchInput("");
        applyPaginatedResponse(response);
      } else if (filter === "id" && q) {
        const response = isDeleted
          ? await fetchDeletedWarehouseById(q)
          : await fetchWarehouseById(q);
        applyCurrentResponse(response);
      } else if (filter === "name" && q) {
        const response = isDeleted
          ? await fetchDeletedWarehousesByName({
              page: pageNumber,
              size: pageSize,
              sortDirection: sortDirectionParam,
              sortField: sortFieldParam,
              searchValue: q,
            })
          : await fetchWarehousesByName({
              page: pageNumber,
              size: pageSize,
              sortDirection: sortDirectionParam,
              sortField: sortFieldParam,
              searchValue: q,
            });
        applyPaginatedResponse(response);
      } else if (filter === "capacity" && q) {
        const response = await fetchWarehousesByCapacity(q, {
          page: pageNumber,
          size: pageSize,
          sortDirection: sortDirectionParam,
          sortField: sortFieldParam,
        });
        applyPaginatedResponse(response);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setDataList([]);
      ToastMessage({
        type: "error",
        title: apiError.title,
        description: apiError.description,
      });
    } finally {
      setPage(pageNumber);
    }
  };

  const handleSearch = async () => {
    await fetchData(0, size, sortField, sortDirection);
  };

  const handleNextPage = async () => {
    if (page < totalPages - 1) {
      await fetchData(page + 1, size, sortField, sortDirection);
    }
  };

  const handlePrevPage = async () => {
    if (page > 0) {
      await fetchData(page - 1, size, sortField, sortDirection);
    }
  };

  const disablePagination = totalElements < size;

  return (
    <Card
      className={`w-full p-4 sm:p-6 bg-background ${
        theme === "system" ? "bg-gray-950/70" : ""
      }`}
    >
      <TableToolbar
        filter={filter}
        onFilterChange={(val) => setFilter(val)}
        filterOptions={!isDeleted ? filterList : filterListDeleted}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        isPriceRange={false}
        searchMin={""}
        searchMax={""}
        onSearchMinChange={() => {}}
        onSearchMaxChange={() => {}}
        onSubmit={handleSearch}
        size={size}
        onSizeChange={(n) => setSize(n)}
        sizeOptions={sizeOptions}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortFields={sortFields}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        sortDirections={sortDirections}
        isLoading={isLoading}
        sizeHidden={sizeHidden}
      />

      <div className="overflow-x-auto rounded-md border w-full">
        <div className="hidden sm:block">
          <Table className="min-w-150">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center text-xs sm:text-sm">Id</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">Name</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">Location</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">Total Capacity</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {dataList && dataList.length > 0 ? (
                dataList.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell className="text-center">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <span className="block truncate max-w-15 overflow-hidden whitespace-nowrap text-xs sm:text-sm">
                          {data.id}
                        </span>
                        <Button
                          size="xs"
                          variant={"ghost"}
                          className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                          onClick={() => {
                            navigator.clipboard.writeText(data.id);
                            ToastMessage({
                              type: "success",
                              title: "UUID copied",
                              description: `Warehouse ID ${data.id} copied to clipboard.`,
                            });
                          }}
                          aria-label="Copy id"
                        >
                          <Copy />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-35 overflow-hidden whitespace-nowrap">
                      {data.name}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-35 overflow-hidden whitespace-nowrap">
                      {data.location}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-35 overflow-hidden whitespace-nowrap">
                      {data.totalCapacity}
                    </TableCell>

                    <TableCell className="flex flex-wrap justify-center gap-2">
                      <Button
                        size="sm"
                        variant={"ghost"}
                        className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                        onClick={() => {
                          setSelectedItem(data.id);
                          setViewOpen(true);
                        }}
                        aria-label="View warehouse"
                      >
                        <Eye /> <span className="hidden sm:inline">View</span>
                      </Button>

                      <div className={`${isDeleted === true ? "hidden" : ""} flex flex-wrap justify-center gap-2`}>
                        <Button
                          size="sm"
                          variant={"ghost"}
                          className={`cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80 ${role !== "ROLE_ADMIN" && role !== "ROLE_WAREHOUSE" ? "hidden" : ""}`}
                          onClick={() => {
                            setSelectedItem(data.id);
                            setUpdateOpen(true);
                          }}
                          aria-label="Edit warehouse"
                        >
                          <NotebookPen /> <span className="hidden sm:inline">Edit</span>
                        </Button>
                        {role === "ROLE_ADMIN" && (
                          <ConfirmDeleteWarehouse
                            warehouseId={data.id}
                            onDone={() => fetchData(page, size, sortField, sortDirection)}
                          />
                        )}
                      </div>

                      {role === "ROLE_ADMIN" && isDeleted === true && (
                        <ConfirmRestoreWarehouse
                          warehouseId={data.id}
                          onDone={() => fetchData(page, size, sortField, sortDirection)}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-primary/80">
                    🚨 No Warehouses found 🚨
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="sm:hidden space-y-3 bg-background/40">
          {dataList && dataList.length > 0 ? (
            dataList.map((data) => (
              <div key={data.id} className="p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-xs text-primary/80 truncate">
                    {data.id}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="cursor-pointer text-slate-500 border border-slate-500 hover:border-primary/80"
                      onClick={() => {
                        navigator.clipboard.writeText(data.id);
                        ToastMessage({
                          type: "success",
                          title: "UUID copied",
                          description: `Warehouse ID ${data.id} copied to clipboard.`,
                        });
                      }}
                      aria-label="Copy id"
                    >
                      <Copy />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="cursor-pointer text-blue-500 border border-blue-500 hover:border-primary/80"
                      onClick={() => {
                        setSelectedItem(data.id);
                        setViewOpen(true);
                      }}
                      aria-label="View"
                    >
                      <Eye />
                    </Button>

                    <div className={`${isDeleted === true ? "hidden" : ""} flex items-center gap-2`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`cursor-pointer text-green-500 border border-green-500 hover:border-primary/80 ${role !== "ROLE_ADMIN" && role !== "ROLE_WAREHOUSE" ? "hidden" : ""}`}
                        onClick={() => {
                          setSelectedItem(data.id);
                          setUpdateOpen(true);
                        }}
                        aria-label="Edit"
                      >
                        <NotebookPen />
                      </Button>

                      {role === "ROLE_ADMIN" && (
                        <ConfirmDeleteWarehouse
                          warehouseId={data.id}
                          isMobile
                          onDone={() => fetchData(page, size, sortField, sortDirection)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="font-semibold">Name</div>
                  <div className="truncate">{data.name}</div>

                  <div className="font-semibold">Location</div>
                  <div className="truncate">{data.location}</div>

                  <div className="font-semibold">Total Capacity</div>
                  <div className="truncate">{data.totalCapacity}</div>
                </div>
                <Separator className="mt-3"/>
              </div>
              
            ))
          ) : (
            <div className="text-center py-6 text-primary/80">
              🚨 No Warehouses found 🚨
            </div>
          )}
        </div>
      </div>

      <TablePagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        disablePagination={disablePagination}
        sizeHidden={sizeHidden}
      />

      <Sheet open={viewOpen} onOpenChange={setViewOpen}>
        <SheetContent
          side="right"
          className={`flex flex-col overflow-y-auto border rounded-md shadow-lg bg-background  ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && <ViewWarehouse warehouseId={selectedItem} isDeleted={isDeleted} />}
        </SheetContent>
      </Sheet>

      <Sheet open={updateOpen} onOpenChange={(open) => setUpdateOpen(open)}>
        <SheetContent
          side="right"
          className={`flex flex-col overflow-y-auto border rounded-md shadow-lg bg-background  ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <UpdateWarehouse
              warehouseId={selectedItem}
              onDone={() => fetchData(page, size, sortField, sortDirection)}
            />
          )}
        </SheetContent>
      </Sheet>
    </Card>
  );
};
