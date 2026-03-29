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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useUserStore } from "@/store/useUserStore";
import type {
  ApiError,
  ApiResponse,
  ApiResponsePaginated,
} from "@/types/Response";
import { useInventoryStore } from "@/store/useInventoryStore";
import type { Inventory } from "@/types/Inventory";
import { ConfirmDeleteInventory } from "./ConfirmDeleteInventory";
import { ConfirmRestoreInventory } from "./ConfirmRestoreInventory";
import { ViewInventory } from "./ViewInventory";
import { UpdateInventory } from "./UpdateInventory";
import { ViewProduct } from "../product/ViewProduct";
import { ViewWarehouse } from "../warehouse/ViewWarehouse";
import { RegisterEntry } from "./RegisterEntry";
import { RegisterExit } from "./RegisterExit";
import { CreateOrderLine } from "../order/CreateOrderLine";
import {
  Copy,
  Eye,
  NotebookPen,
  ArrowBigLeft,
  ArrowBigRight,
  CirclePlus,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { sizeOptions, sortDirections } from "@/types/Request";
import { TableToolbar } from "../TableToolBar";
import { TablePagination } from "../TablePaginationFooter";

const filterList = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
  { value: "productId", label: "Product" },
  { value: "warehouseId", label: "Warehouse" },
  { value: "lowStock", label: "Low stock" },
];

const filterListDeleted = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
  { value: "name", label: "Product name" },
];

const sortFields = [
  { value: "warehouse.name", label: "Warehouse" },
  { value: "product.name", label: "Product" },
  { value: "location", label: "Location" },
  { value: "lot", label: "Lot" },
  { value: "availableQuantity", label: "Quantity" },
  { value: "createdAt", label: "Created At" },
];

interface TableProps {
  isDeleted: boolean;
}

export const InventoryTable = ({ isDeleted }: TableProps) => {
  const {
    fetchAllDeletedInventories,
    fetchAllInventories,
    fetchDeletedInventoriesBYProductName,
    fetchInventoriesBYProductName,
    fetchInventoryBYId,
    fetchInventoriesBYWarehouseId,
    fetchInventoriesByLowStock,
    fetchDeletedInventoryBYId,
    isLoading,
  } = useInventoryStore();

  const { userProfileResponse } = useUserStore();
  const [dataList, setDataList] = useState<Inventory[]>([]);
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
  const [viewInventory, setViewInventory] = useState(false);
  const [viewProduct, setViewProduct] = useState(false);
  const [viewWarehouse, setViewWarehouse] = useState(false);
  const [updateInventory, setUpdateInventory] = useState(false);
  const [createEntry, setCreateEntry] = useState(false);
  const [createExit, setCreateExit] = useState(false);
  const [createOrder, setCreateOrder] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const role = userProfileResponse?.data.role;

  useEffect(() => {
    fetchData(0, size, sortField, sortDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, sortField, sortDirection]);

  const applyPaginatedResponse = (
    response: ApiResponsePaginated<Inventory> | null,
  ) => {
    if (response) {
      const { content, totalPages, totalElements } = response.data;
      setDataList(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setSizeHidden(false);
    }
  };

  const applyCurrentResponse = (response: ApiResponse<Inventory> | null) => {
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
          ? await fetchAllDeletedInventories({
              page: pageNumber,
              size: pageSize,
              sortField: sortFieldParam,
              sortDirection: sortDirectionParam,
            })
          : await fetchAllInventories({
              page: pageNumber,
              size: pageSize,
              sortField: sortFieldParam,
              sortDirection: sortDirectionParam,
            });
        setSearchInput("");
        applyPaginatedResponse(response);
      } else if (filter === "id" && q) {
        const response = isDeleted
          ? await fetchDeletedInventoryBYId(q)
          : await fetchInventoryBYId(q);
        applyCurrentResponse(response);
      } else if (
        (filter === "name" ||
          filter === "productId" ||
          filter === "warehouseId" ||
          filter === "lowStock") &&
        q
      ) {
        const response =
          filter === "name"
            ? await fetchDeletedInventoriesBYProductName({
                page: pageNumber,
                size: pageSize,
                sortField: sortFieldParam,
                sortDirection: sortDirectionParam,
                searchValue: q,
              })
            : filter === "productId"
              ? await fetchInventoriesBYProductName({
                  page: pageNumber,
                  size: pageSize,
                  sortField: sortFieldParam,
                  sortDirection: sortDirectionParam,
                  searchValue: q,
                })
              : filter === "warehouseId"
                ? await fetchInventoriesBYWarehouseId({
                    page: pageNumber,
                    size: pageSize,
                    sortField: sortFieldParam,
                    sortDirection: sortDirectionParam,
                    searchValue: q,
                  })
                : await fetchInventoriesByLowStock({
                      page: pageNumber,
                      size: pageSize,
                      sortField: sortFieldParam,
                      sortDirection: sortDirectionParam,
                      searchNumber: q,
                    })
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
      className={`w-full p-6 bg-background ${
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

      <div className="overflow-auto rounded-md border w-full">
        <div className="hidden sm:block">
          <Table className="min-w-full sm:min-w-200">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Id</TableHead>
                <TableHead className="text-center">Warehouse</TableHead>
                <TableHead className="text-center">Product</TableHead>
                <TableHead className="text-center">Location</TableHead>
                <TableHead className="text-center">Lot</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead
                  className={`text-center ${isDeleted ? "hidden" : ""}`}
                >
                  Movements
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
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
                          variant="ghost"
                          className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                          onClick={() => {
                            navigator.clipboard.writeText(data.id);
                            ToastMessage({
                              type: "success",
                              title: "UUID copied",
                              description: `Inventory ID ${data.id} copied to clipboard.`,
                            });
                          }}
                          aria-label="Copy id"
                        >
                          <Copy />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-35 overflow-hidden whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">
                          {data.warehouse?.name}
                        </span>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              setSelectedItem(data.warehouse.id);
                              setViewWarehouse(true);
                            }}
                            aria-label="View warehouse"
                          >
                            <Eye />
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              navigator.clipboard.writeText(data.warehouse.id);
                              ToastMessage({
                                type: "success",
                                title: "UUID copied",
                                description: `Warehouse ID ${data.warehouse.id} copied to clipboard.`,
                              });
                            }}
                            aria-label="Copy warehouse id"
                          >
                            <Copy />
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-35 overflow-hidden whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">
                          {data.product?.name}
                        </span>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              setSelectedItem(data.product.id);
                              setViewProduct(true);
                            }}
                            aria-label="View product"
                          >
                            <Eye />
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              navigator.clipboard.writeText(data.product.id);
                              ToastMessage({
                                type: "success",
                                title: "UUID copied",
                                description: `Product ID ${data.product.id} copied to clipboard.`,
                              });
                            }}
                            aria-label="Copy product id"
                          >
                            <Copy />
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {data.location}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {data.lot}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {data.availableQuantity}
                    </TableCell>

                    {(role === "ROLE_ADMIN" ||
                      role === "ROLE_WAREHOUSE" ||
                      role === "ROLE_DISPATCHER") && (
                      <TableCell
                        className={`text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap ${isDeleted ? "hidden" : ""}`}
                      >
                        <div className="flex flex-col gap-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              setSelectedItem(data.id);
                              setCreateEntry(true);
                            }}
                            aria-label="Entry"
                          >
                            <ArrowBigRight />
                            <span className="hidden sm:inline">Entry</span>
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-red-500 border border-red-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              setSelectedItem(data.id);
                              setCreateExit(true);
                            }}
                            aria-label="Exit"
                          >
                            <ArrowBigLeft />
                            <span className="hidden sm:inline">Exit</span>
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              setSelectedItem(data.id);
                              setCreateOrder(true);
                            }}
                            aria-label="Order"
                          >
                            <CirclePlus />
                            <span className="hidden sm:inline">Order</span>
                          </Button>
                        </div>
                      </TableCell>
                    )}

                    <TableCell>
                      <div className="flex flex-wrap justify-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                          onClick={() => {
                            setSelectedItem(data.id);
                            setViewInventory(true);
                          }}
                          aria-label="View inventory"
                        >
                          <Eye /> <span className="hidden sm:inline">View</span>
                        </Button>

                        <div
                          className={`${isDeleted === true ? "hidden" : ""} flex justify-center gap-2`}
                        >
                          {(role === "ROLE_ADMIN" ||
                            role === "ROLE_DISPATCHER" ||
                            role === "ROLE_WAREHOUSE") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80 ${role !== "ROLE_ADMIN" && role !== "ROLE_WAREHOUSE" ? "hidden" : ""}`}
                              onClick={() => {
                                setSelectedItem(data.id);
                                setUpdateInventory(true);
                              }}
                              aria-label="Edit inventory"
                            >
                              <NotebookPen />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          )}
                          {role === "ROLE_ADMIN" && (
                            <ConfirmDeleteInventory
                              inventoryId={data.id}
                              onDone={() =>
                                fetchData(page, size, sortField, sortDirection)
                              }
                            />
                          )}
                        </div>

                        {role === "ROLE_ADMIN" && isDeleted === true && (
                          <ConfirmRestoreInventory
                            inventoryId={data.id}
                            onDone={() =>
                              fetchData(page, size, sortField, sortDirection)
                            }
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-primary/80"
                  >
                    🚨 No products found 🚨
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
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="text-xs text-primary/80 truncate">
                    {data.id}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                      onClick={() => {
                        navigator.clipboard.writeText(data.id);
                        ToastMessage({
                          type: "success",
                          title: "UUID copied",
                          description: `Inventory ID ${data.id} copied to clipboard.`,
                        });
                      }}
                      aria-label="Copy id"
                    >
                      <Copy />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                      onClick={() => {
                        setSelectedItem(data.id);
                        setViewInventory(true);
                      }}
                      aria-label="View inventory"
                    >
                      <Eye />
                    </Button>

                    <div
                      className={`${isDeleted === true ? "hidden" : ""} flex justify-center gap-2`}
                    >
                      {(role === "ROLE_ADMIN" ||
                        role === "ROLE_DISPATCHER" ||
                        role === "ROLE_WAREHOUSE") && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
                          onClick={() => {
                            setSelectedItem(data.id);
                            setUpdateInventory(true);
                          }}
                          aria-label="Edit inventory"
                        >
                          <NotebookPen />
                        </Button>
                      )}

                      {role === "ROLE_ADMIN" && (
                        <ConfirmDeleteInventory
                          inventoryId={data.id}
                          isMobile
                          onDone={() =>
                            fetchData(page, size, sortField, sortDirection)
                          }
                        />
                      )}
                    </div>

                    {role === "ROLE_ADMIN" && isDeleted === true && (
                      <ConfirmRestoreInventory
                        inventoryId={data.id}
                        isMobile
                        onDone={() =>
                          fetchData(page, size, sortField, sortDirection)
                        }
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 items-center gap-2 text-xs">
                  <div className="font-semibold">Warehouse</div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate max-w-25 overflow-hidden whitespace-nowrap">
                      {data.warehouse?.name}
                    </p>
                    <span className="flex gap-1">
                      <Button
                        size="xs"
                        variant="ghost"
                        className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                        onClick={() => {
                          navigator.clipboard.writeText(data.warehouse?.id);
                          ToastMessage({
                            type: "success",
                            title: "UUID copied",
                            description: `Warehouse ID ${data.warehouse?.id} copied to clipboard.`,
                          });
                        }}
                        aria-label="Copy id"
                      >
                        <Copy />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                        onClick={() => {
                          setSelectedItem(data.warehouse.id);
                          setViewWarehouse(true);
                        }}
                        aria-label="View"
                      >
                        <Eye />
                      </Button>
                    </span>
                  </div>
                  <div className="font-semibold">Product</div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate max-w-25 overflow-hidden whitespace-nowrap">
                      {data.product?.name}
                    </p>
                    <span className="flex gap-1">
                      <Button
                        size="xs"
                        variant="ghost"
                        className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                        onClick={() => {
                          navigator.clipboard.writeText(data.product.id);
                          ToastMessage({
                            type: "success",
                            title: "UUID copied",
                            description: `Product ID ${data.product.id} copied to clipboard.`,
                          });
                        }}
                        aria-label="Copy id"
                      >
                        <Copy />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                        onClick={() => {
                          setSelectedItem(data.product.id);
                          setViewProduct(true);
                        }}
                        aria-label="View"
                      >
                        <Eye />
                      </Button>
                    </span>
                  </div>
                  <div className="font-semibold">Location</div>
                  <div className="truncate">{data.location}</div>
                  <div className="font-semibold">Lot</div>
                  <div className="truncate">{data.lot}</div>
                  <div className="font-semibold">Quantity</div>
                  <div className="truncate">{data.availableQuantity}</div>

                  {(role === "ROLE_ADMIN" ||
                    role === "ROLE_WAREHOUSE" ||
                    role === "ROLE_DISPATCHER") && (
                    <div
                      className={`${isDeleted ? "hidden" : "flex gap-22 items-center "}`}
                    >
                      <div className="font-semibold">Movements</div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="xs"
                          variant="ghost"
                          className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
                          onClick={() => {
                            setSelectedItem(data.id);
                            setCreateEntry(true);
                          }}
                          aria-label="Entry"
                        >
                          <ArrowBigRight /> <span>Entry</span>
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          className="cursor-pointer font-medium text-red-500 border border-red-500 hover:border-primary/80 hover:text-primary/80"
                          onClick={() => {
                            setSelectedItem(data.id);
                            setCreateExit(true);
                          }}
                          aria-label="Exit"
                        >
                          <ArrowBigLeft /> <span>Exit</span>
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                          onClick={() => {
                            setSelectedItem(data.id);
                            setCreateOrder(true);
                          }}
                          aria-label="Order"
                        >
                          <CirclePlus /> <span>Order</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="mt-3" />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-primary/80">
              🚨 No products found 🚨
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

      <Sheet open={viewInventory} onOpenChange={setViewInventory}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewInventory inventoryId={selectedItem} isDeleted={isDeleted} />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={viewProduct} onOpenChange={setViewProduct}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewProduct productId={selectedItem} isDeleted={false} />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={viewWarehouse} onOpenChange={setViewWarehouse}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewWarehouse warehouseId={selectedItem} isDeleted={false} />
          )}
        </SheetContent>
      </Sheet>

      <Sheet
        open={updateInventory}
        onOpenChange={(open) => setUpdateInventory(open)}
      >
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <UpdateInventory
              inventoryId={selectedItem}
              onDone={() => fetchData(page, size, sortField, sortDirection)}
            />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={createEntry} onOpenChange={(open) => setCreateEntry(open)}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <RegisterEntry
              inventoryId={selectedItem}
              onDone={() => fetchData(page, size, sortField, sortDirection)}
            />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={createExit} onOpenChange={(open) => setCreateExit(open)}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <RegisterExit
              inventoryId={selectedItem}
              onDone={() => fetchData(page, size, sortField, sortDirection)}
            />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={createOrder} onOpenChange={(open) => setCreateOrder(open)}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <CreateOrderLine
              inventoryId={selectedItem}
              onDone={() => fetchData(page, size, sortField, sortDirection)}
            />
          )}
        </SheetContent>
      </Sheet>
    </Card>
  );
};
