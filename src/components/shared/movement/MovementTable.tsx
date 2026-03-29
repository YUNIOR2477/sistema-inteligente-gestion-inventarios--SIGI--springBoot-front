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
import { ViewMovement } from "./ViewMovement";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { UpdateMovement } from "./UpdateMovement";
import { ConfirmDeleteMovement } from "./ConfirmDeleteMovement";
import { useUserStore } from "@/store/useUserStore";
import type {
  ApiError,
  ApiResponse,
  ApiResponsePaginated,
} from "@/types/Response";
import { ConfirmRestoreMovement } from "./ConfirmRestoreMovement";
import { Copy, Eye, NotebookPen } from "lucide-react";
import { useMovementStore } from "@/store/useMovementStore";
import type { Movement } from "@/types/Movement";
import { ViewProduct } from "../product/ViewProduct";
import { ViewDispatcher } from "../dispatcher/ViewDispatcher";
import { ViewInventory } from "../inventory/ViewInventory";
import { ViewOrder } from "../order/ViewOrder";
import { Separator } from "@/components/ui/separator";
import { sizeOptions, sortDirections } from "@/types/Request";
import { TableToolbar } from "../TableToolBar";
import { TablePagination } from "../TablePaginationFooter";

const filterList = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
  { value: "order", label: "Order client" },
  { value: "product", label: "Product" },
  { value: "dispatcher", label: "Dispatcher" },
  { value: "type", label: "Type" },
];

const filterListDeleted = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
  { value: "type", label: "Type" },
];

const sortFields = [
  { value: "inventory.lot", label: "Inventory lot" },
  { value: "order.client.name", label: "Order client" },
  { value: "product.name", label: "Product" },
  { value: "dispatcher.name", label: "Dispatcher" },
  { value: "quantity", label: "Quantity" },
  { value: "type", label: "Type" },
  { value: "createdAt", label: "Created At" },
];

interface TableProps {
  isDeleted: boolean;
}

export const MovementTable = ({ isDeleted }: TableProps) => {
  const {
    fetchAllDeletedMovements,
    fetchAllMovements,
    fetchDeletedMovementsByType,
    fetchMovementById,
    fetchDeletedMovementById,
    fetchMovementsByDispatcher,
    fetchMovementsByOrder,
    fetchMovementsByProduct,
    fetchMovementsByType,
    isLoading,
  } = useMovementStore();

  const { userProfileResponse } = useUserStore();
  const [dataList, setDataList] = useState<Movement[]>([]);
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
  const [viewMovement, setViewMovement] = useState(false);
  const [viewProduct, setViewProduct] = useState(false);
  const [viewInventory, setViewInventory] = useState(false);
  const [viewOrder, setViewOrder] = useState(false);
  const [viewDispatcher, setViewDispatcher] = useState(false);
  const [updateMovement, setUpdateMovement] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const role = userProfileResponse?.data.role;

  useEffect(() => {
    fetchData(0, size, sortField, sortDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, sortField, sortDirection]);

  const applyPaginatedResponse = (
    response: ApiResponsePaginated<Movement> | null,
  ) => {
    if (response) {
      const { content, totalPages, totalElements } = response.data;
      setDataList(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setSizeHidden(false);
    }
  };

  const applyCurrentResponse = (response: ApiResponse<Movement> | null) => {
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
          ? await fetchAllDeletedMovements({
            page: pageNumber,
            size: pageSize,
            sortDirection: sortDirectionParam,
            sortField: sortFieldParam,
          })
          : await fetchAllMovements({
            page: pageNumber,
            size: pageSize,
            sortDirection: sortDirectionParam,
            sortField: sortFieldParam,
          });
        setSearchInput("");
        applyPaginatedResponse(response);
      } else if (filter === "id" && q) {
        const response = isDeleted
          ? await fetchDeletedMovementById(q)
          : await fetchMovementById(q);
        applyCurrentResponse(response);
      } else if (filter === "type" && q) {
        const response = isDeleted
          ? await fetchDeletedMovementsByType(q, {
            page: pageNumber,
            size: pageSize,
            sortField: sortFieldParam,
            sortDirection: sortDirectionParam,
          })
          : await fetchMovementsByType(q, {
            page: pageNumber,
            size: pageSize,
            sortField: sortFieldParam,
            sortDirection: sortDirectionParam,
          });
        applyPaginatedResponse(response);
      } else if (
        (filter === "product" ||
          filter === "order" ||
          filter === "dispatcher") &&
        q
      ) {
        const response =
          filter === "product"
            ? await fetchMovementsByProduct({
              page: pageNumber,
              size: pageSize,
              sortField: sortFieldParam,
              sortDirection: sortDirectionParam,
              searchValue: q,
            })
            : filter === "dispatcher"
              ? await fetchMovementsByDispatcher({
                page: pageNumber,
                size: pageSize,
                sortField: sortFieldParam,
                sortDirection: sortDirectionParam,
                searchValue: q,
              })
              : await fetchMovementsByOrder({
                page: pageNumber,
                size: pageSize,
                sortField: sortFieldParam,
                sortDirection: sortDirectionParam,
                searchValue: q,
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
      className={`w-full p-6 bg-background ${theme === "system" ? "bg-gray-950/70" : ""
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
        onSearchMinChange={() => { }}
        onSearchMaxChange={() => { }}
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
                <TableHead className="text-center">Inventory lot</TableHead>
                <TableHead className="text-center">Order client</TableHead>
                <TableHead className="text-center">Product</TableHead>
                <TableHead className="text-center">Dispatcher</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Type</TableHead>
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
                              description: `Movement ID ${data.id} copied to clipboard.`,
                            });
                          }}
                          aria-label="Copy id"
                        >
                          <Copy />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-35 overflow-hidden whitespace-nowrap">
                      <div className="flex items-center gap-2 justify-between">
                        <span className="truncate">
                          {data.inventory?.lot}
                        </span>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              setSelectedItem(data.inventory.id);
                              setViewInventory(true);
                            }}
                            aria-label="View inventory"
                          >
                            <Eye />
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              navigator.clipboard.writeText(data.inventory.id);
                              ToastMessage({
                                type: "success",
                                title: "UUID copied",
                                description: `Inventory ID ${data.inventory.id} copied to clipboard.`,
                              });
                            }}
                            aria-label="Copy inventory id"
                          >
                            <Copy />
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-35 overflow-hidden whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">
                          {data.order?.client.name ?? "N/A"}
                        </span>
                        <div
                          className={`flex flex-col gap-1 ${data.order?.id ? "" : "hidden"}`}
                        >
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              setSelectedItem(data.order!.id);
                              setViewOrder(true);
                            }}
                            aria-label="View order"
                          >
                            <Eye />
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              if (data.order?.id) {
                                navigator.clipboard.writeText(data.order.id);
                                ToastMessage({
                                  type: "success",
                                  title: "UUID copied",
                                  description: `Order ID ${data.order.id} copied to clipboard.`,
                                });
                              }
                            }}
                            aria-label="Copy order id"
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
                              setSelectedItem(data.product!.id);
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
                              if (data.product?.id) {
                                navigator.clipboard.writeText(data.product.id);
                                ToastMessage({
                                  type: "success",
                                  title: "UUID copied",
                                  description: `Product ID ${data.product.id} copied to clipboard.`,
                                });
                              }
                            }}
                            aria-label="Copy product id"
                          >
                            <Copy />
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-35 overflow-hidden whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">
                          {data.dispatcher?.name ?? "N/A"}
                        </span>
                        <div
                          className={`flex flex-col gap-1 ${data.dispatcher?.id ? "" : "hidden"}`}
                        >
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              setSelectedItem(data.dispatcher!.id);
                              setViewDispatcher(true);
                            }}
                            aria-label="View dispatcher"
                          >
                            <Eye />
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              if (data.dispatcher?.id) {
                                navigator.clipboard.writeText(
                                  data.dispatcher.id,
                                );
                                ToastMessage({
                                  type: "success",
                                  title: "UUID copied",
                                  description: `Dispatcher ID ${data.dispatcher.id} copied to clipboard.`,
                                });
                              }
                            }}
                            aria-label="Copy dispatcher id"
                          >
                            <Copy />
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-15 overflow-hidden whitespace-nowrap">
                      {data.quantity}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-15 overflow-hidden whitespace-nowrap">
                      {data.type}
                    </TableCell>

                    <TableCell className="p-2">
                      <div className="flex h-full items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                          onClick={() => {
                            setSelectedItem(data.id);
                            setViewMovement(true);
                          }}
                          aria-label="View movement"
                        >
                          <Eye /> <span className="hidden sm:inline">View</span>
                        </Button>

                        <div
                          className={`${isDeleted === true ? "hidden" : ""} flex flex-wrap justify-center gap-2`}
                        >
                          {(role === "ROLE_ADMIN" ||
                            role === "ROLE_WAREHOUSE" ||
                            role === "ROLE_DISPATCHER") && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80 ${role !== "ROLE_ADMIN" && role !== "ROLE_WAREHOUSE" && role !== "ROLE_DISPATCHER" ? "hidden" : ""}`}
                                onClick={() => {
                                  setSelectedItem(data.id);
                                  setUpdateMovement(true);
                                }}
                                aria-label="Edit movement"
                              >
                                <NotebookPen />{" "}
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                            )}
                          {role === "ROLE_ADMIN" && (
                            <ConfirmDeleteMovement
                              movementId={data.id}
                              onDone={() =>
                                fetchData(page, size, sortField, sortDirection)
                              }
                            />
                          )}
                        </div>

                        {role === "ROLE_ADMIN" && isDeleted === true && (
                          <ConfirmRestoreMovement
                            movementId={data.id}
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
                    🚨 No Movements found 🚨
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
                          description: `Movement ID ${data.id} copied to clipboard.`,
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
                        setViewMovement(true);
                      }}
                      aria-label="View movement"
                    >
                      <Eye />
                    </Button>

                    <div
                      className={`${isDeleted === true ? "hidden" : ""} flex justify-center gap-2`}
                    >
                      {(role === "ROLE_ADMIN" ||
                        role === "ROLE_WAREHOUSE" ||
                        role === "ROLE_DISPATCHER") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80 ${role !== "ROLE_ADMIN" && role !== "ROLE_WAREHOUSE" && role !== "ROLE_DISPATCHER" ? "hidden" : ""}`}
                            onClick={() => {
                              setSelectedItem(data.id);
                              setUpdateMovement(true);
                            }}
                            aria-label="Edit movement"
                          >
                            <NotebookPen />
                          </Button>
                        )}
                      {role === "ROLE_ADMIN" && (
                        <ConfirmDeleteMovement
                          movementId={data.id}
                          isMobile
                          onDone={() =>
                            fetchData(page, size, sortField, sortDirection)
                          }
                        />
                      )}
                    </div>

                    {role === "ROLE_ADMIN" && isDeleted === true && (
                      <ConfirmRestoreMovement
                        movementId={data.id}
                        isMobile
                        onDone={() =>
                          fetchData(page, size, sortField, sortDirection)
                        }
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 items-center text-xs">
                  <div className="font-semibold">Inventory lot</div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate max-w-25 overflow-hidden whitespace-nowrap">
                      {data.inventory?.lot}
                    </p>
                    <span className="flex gap-1">
                      <Button
                        size="xs"
                        variant="ghost"
                        className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                        onClick={() => {
                          navigator.clipboard.writeText(data.inventory.id);
                          ToastMessage({
                            type: "success",
                            title: "UUID copied",
                            description: `Inventory ID ${data.inventory.id} copied to clipboard.`,
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
                          setSelectedItem(data.inventory.id);
                          setViewInventory(true);
                        }}
                        aria-label="View"
                      >
                        <Eye />
                      </Button>
                    </span>
                  </div>
                  <div className="font-semibold">Order client</div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate max-w-25 overflow-hidden whitespace-nowrap">
                      {data.order?.client.name ?? "N/A"}
                    </p>
                    <span
                      className={`flex gap-1 ${data.order?.id ?? "hidden"}`}
                    >
                      <Button
                        size="xs"
                        variant="ghost"
                        className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                        onClick={() => {
                          navigator.clipboard.writeText(data.order.id);
                          ToastMessage({
                            type: "success",
                            title: "UUID copied",
                            description: `order ID ${data.order.id} copied to clipboard.`,
                          });
                        }}
                        aria-label="Copy id"
                      >
                        <Copy />
                      </Button>
                      <Button
                        size="xs"
                        className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                        variant="ghost"
                        onClick={() => {
                          setSelectedItem(data.order.id);
                          setViewOrder(true);
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
                      {data.product.name}
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
                  <div className="font-semibold">Dispatcher</div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate max-w-25 overflow-hidden whitespace-nowrap">
                      {data.dispatcher?.name ?? "N/A"}
                    </p>
                    <span
                      className={`flex gap-1 ${data.dispatcher?.name ?? "hidden"}`}
                    >
                      <Button
                        size="xs"
                        variant="ghost"
                        className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                        onClick={() => {
                          navigator.clipboard.writeText(data.dispatcher.id);
                          ToastMessage({
                            type: "success",
                            title: "UUID copied",
                            description: `Dispatcher ID ${data.dispatcher.id} copied to clipboard.`,
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
                          setSelectedItem(data.dispatcher.id);
                          setViewDispatcher(true);
                        }}
                        aria-label="View"
                      >
                        <Eye />
                      </Button>
                    </span>
                  </div>
                  <div className="font-semibold">Quantity</div>
                  <div className="truncate">{data.quantity}</div>
                  <div className="font-semibold">Type</div>
                  <div className="truncate">{data.type}</div>
                </div>

                <Separator className="mt-3" />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-primary/80">
              🚨 No Movements found 🚨
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

      <Sheet open={viewMovement} onOpenChange={setViewMovement}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewMovement movementId={selectedItem} isDeleted={isDeleted} />
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

      <Sheet open={viewInventory} onOpenChange={setViewInventory}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewInventory inventoryId={selectedItem} isDeleted={false} />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={viewOrder} onOpenChange={setViewOrder}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewOrder orderId={selectedItem} isDeleted={false} />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={viewDispatcher} onOpenChange={setViewDispatcher}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewDispatcher dispatcherId={selectedItem} isDeleted={false} />
          )}
        </SheetContent>
      </Sheet>

      <Sheet
        open={updateMovement}
        onOpenChange={(open) => setUpdateMovement(open)}
      >
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <UpdateMovement
              movementId={selectedItem}
              onDone={() => fetchData(page, size, sortField, sortDirection)}
            />
          )}
        </SheetContent>
      </Sheet>
    </Card>
  );
};
