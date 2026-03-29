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
import {
  Eye,
  Copy,
  PackagePlus,
  Printer,
  HandCoins,
  NotebookPen,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type {
  ApiError,
  ApiResponse,
  ApiResponsePaginated,
} from "@/types/Response";
import { sizeOptions, sortDirections } from "@/types/Request";
import type { Order } from "@/types/Order";
import { useOrderStore } from "@/store/useOrderStore";
import { useUserStore } from "@/store/useUserStore";
import { ViewOrder } from "./ViewOrder";
import { UpdateOrder } from "./UpdateOrder";
import { ConfirmDeleteOrder } from "./ConfirmDeleteOrder";
import { ConfirmRestoreOrder } from "./ConfirmRestoreOrder";
import { ViewClient } from "../client/ViewClient";
import { ViewUser } from "../user/ViewUser";
import { ViewWarehouse } from "../warehouse/ViewWarehouse";
import { CreateInvoice } from "../invoice/CreateInvoice";
import { ViewInvoice } from "../invoice/ViewInvoice";
import { CreateOrderLine } from "./CreateOrderLine";
import { TableToolbar } from "../TableToolBar";
import { TablePagination } from "../TablePaginationFooter";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const filterList = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
  { value: "clientName", label: "Client" },
  { value: "seller", label: "Seller" },
];

const filterListDeleted = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
];

const sortFields = [
  { value: "client.name", label: "Client" },
  { value: "user.email", label: "Seller" },
  { value: "warehouse.name", label: "Warehouse" },
  { value: "status", label: "Status" },
  { value: "total", label: "Subtotal" },
  { value: "createdAt", label: "Created At" },
];

interface TableProps {
  isDeleted: boolean;
}

export const OrderTable = ({ isDeleted }: TableProps) => {
  const {
    fetchAllOrders,
    fetchAllDeletedOrders,
    fetchOrderById,
    fetchDeletedOrderById,
    fetchOrdersByUser,
    fetchOrdersByClientName,
    isLoading,
  } = useOrderStore();

  const { userProfileResponse } = useUserStore();
  const role = userProfileResponse?.data.role;

  const [dataList, setDataList] = useState<Order[]>([]);
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

  const [viewOrder, setViewOrder] = useState(false);
  const [viewClient, setViewClient] = useState(false);
  const [viewSeller, setViewSeller] = useState(false);
  const [viewWarehouse, setViewWarehouse] = useState(false);
  const [updateOrder, setUpdateOrder] = useState(false);
  const [createInvoice, setCreateInvoice] = useState(false);
  const [createOrderLine, setCreateOrderLine] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    void fetchData(0, size, sortField, sortDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, sortField, sortDirection]);

  const applyPaginatedResponse = (
    response: ApiResponsePaginated<Order> | null,
  ) => {
    if (response) {
      const { content, totalPages, totalElements } = response.data;
      setDataList(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setSizeHidden(false);
    }
  };

  const applyCurrentResponse = (response: ApiResponse<Order> | null) => {
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
          ? await fetchAllDeletedOrders({
              page: pageNumber,
              size: pageSize,
              sortDirection: sortDirectionParam,
              sortField: sortFieldParam,
            })
          : await fetchAllOrders({
              page: pageNumber,
              size: pageSize,
              sortDirection: sortDirectionParam,
              sortField: sortFieldParam,
            });
        setSearchInput("");
        applyPaginatedResponse(response);
      } else if (filter === "id" && q) {
        const response = isDeleted
          ? await fetchDeletedOrderById(q)
          : await fetchOrderById(q);
        applyCurrentResponse(response);
      } else if ((filter === "clientName" || filter === "seller") && q) {
        const response =
          filter === "clientName"
            ? await fetchOrdersByClientName({
                searchValue: q,
                page: pageNumber,
                size: pageSize,
                sortDirection: sortDirectionParam,
                sortField: sortFieldParam,
              })
            : await fetchOrdersByUser({
                searchValue: q,
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
      className={`w-full p-6 bg-background ${theme === "system" ? "bg-gray-950/70" : ""}`}
    >
      <TableToolbar
        filter={filter}
        onFilterChange={setFilter}
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

      <div className="overflow-auto rounded-md border w-full mt-3">
        <div className="hidden sm:block">
          <Table className="min-w-full sm:min-w-200">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Id</TableHead>
                <TableHead className="text-center">Client</TableHead>
                <TableHead className="text-center">Seller</TableHead>
                <TableHead className="text-center">Warehouse</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Subtotal</TableHead>
                {(role === "ROLE_ADMIN" || role === "ROLE_SELLER") && (
                  <>
                    <TableHead className="text-center">Order</TableHead>
                    <TableHead className="text-center">Invoice</TableHead>
                  </>
                )}
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
                              description: `Order ID ${data.id} copied to clipboard.`,
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
                        <span className="truncate max-w-25">
                          {data.client?.name}
                        </span>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              setSelectedItem(data.client.id);
                              setViewClient(true);
                            }}
                            aria-label="View client"
                          >
                            <Eye />
                          </Button>
                          <Button
                            size="xs"
                            className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(data.client.id);
                              ToastMessage({
                                type: "success",
                                title: "UUID copied",
                                description: `Client ID ${data.client.id} copied to clipboard.`,
                              });
                            }}
                            aria-label="Copy id"
                          >
                            <Copy />
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-35 overflow-hidden whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate max-w-25">
                          {data.user?.email}
                        </span>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              setSelectedItem(data.user.id);
                              setViewSeller(true);
                            }}
                            aria-label="View seller"
                          >
                            <Eye />
                          </Button>
                          <Button
                            size="xs"
                            className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(data.user.id);
                              ToastMessage({
                                type: "success",
                                title: "UUID copied",
                                description: `User ID ${data.user.id} copied to clipboard.`,
                              });
                            }}
                            aria-label="Copy id"
                          >
                            <Copy />
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-35 overflow-hidden whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate max-w-25">
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
                            className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(data.warehouse.id);
                              ToastMessage({
                                type: "success",
                                title: "UUID copied",
                                description: `Order ID ${data.warehouse.id} copied to clipboard.`,
                              });
                            }}
                            aria-label="Copy id"
                          >
                            <Copy />
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {data.status}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      ${data.total}
                    </TableCell>

                    {(role === "ROLE_ADMIN" || role === "ROLE_SELLER") && (
                      <>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="xs"
                              variant="ghost"
                              disabled={data.status !== "DRAFT"}
                              className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
                              onClick={() => {
                                setSelectedItem(data.id);
                                setCreateOrderLine(true);
                              }}
                              aria-label="Create order line"
                            >
                              <PackagePlus />
                            </Button>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex flex-col gap-1 items-center">
                            <Button
                              size="xs"
                              variant="ghost"
                              disabled={data.status !== "DRAFT"}
                              className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
                              onClick={() => {
                                setSelectedItem(data.id);
                                setCreateInvoice(true);
                              }}
                              aria-label="Create invoice"
                            >
                              <Printer />
                            </Button>

                            <Button
                              size="xs"
                              variant="ghost"
                              disabled={data.status === "DRAFT"}
                              className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                              onClick={() => {
                                setSelectedItem(data.id);
                                setViewInvoice(true);
                              }}
                              aria-label={
                                data.status !== "CONFIRMED"
                                  ? "View invoice"
                                  : "Pay invoice"
                              }
                            >
                              {data.status !== "CONFIRMED" ? (
                                <Eye />
                              ) : (
                                <HandCoins />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}

                    <TableCell className="p-2">
                      <div className="flex h-full items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                          onClick={() => {
                            setSelectedItem(data.id);
                            setViewOrder(true);
                          }}
                          aria-label="View order"
                        >
                          <Eye /> <span className="hidden sm:inline">View</span>
                        </Button>

                        <div
                          className={`${isDeleted === true ? "hidden" : ""} flex flex-wrap justify-center gap-2`}
                        >
                          {(role === "ROLE_ADMIN" ||
                            role === "ROLE_SELLER") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
                              onClick={() => {
                                setSelectedItem(data.id);
                                setUpdateOrder(true);
                              }}
                              aria-label="Edit order"
                            >
                              <NotebookPen />{" "}
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          )}
                          {role === "ROLE_ADMIN" && (
                            <ConfirmDeleteOrder
                              orderId={data.id}
                              onDone={() =>
                                fetchData(page, size, sortField, sortDirection)
                              }
                            />
                          )}
                        </div>

                        {role === "ROLE_ADMIN" && isDeleted === true && (
                          <ConfirmRestoreOrder
                            orderId={data.id}
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
                    colSpan={9}
                    className="text-center py-6 text-primary/80"
                  >
                    🚨 No Orders found 🚨
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
                      className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(data.id);
                        ToastMessage({
                          type: "success",
                          title: "UUID copied",
                          description: `Order ID ${data.id} copied to clipboard.`,
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
                        setViewOrder(true);
                      }}
                      aria-label="View order"
                    >
                      <Eye />
                    </Button>

                    <div
                      className={`${isDeleted === true ? "hidden" : ""} flex justify-center gap-2`}
                    >
                      {(role === "ROLE_ADMIN" || role === "ROLE_SELLER") && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80 "
                          onClick={() => {
                            setSelectedItem(data.id);
                            setUpdateOrder(true);
                          }}
                          aria-label="Edit order"
                        >
                          <NotebookPen />{" "}
                        </Button>
                      )}
                      {role === "ROLE_ADMIN" && (
                        <ConfirmDeleteOrder
                          orderId={data.id}
                          isMobile
                          onDone={() =>
                            fetchData(page, size, sortField, sortDirection)
                          }
                        />
                      )}
                    </div>

                    {role === "ROLE_ADMIN" && isDeleted === true && (
                      <ConfirmRestoreOrder
                        orderId={data.id}
                        isMobile
                        onDone={() =>
                          fetchData(page, size, sortField, sortDirection)
                        }
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 items-center text-xs">
                  <div className="font-semibold">Client</div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate max-w-25 overflow-hidden whitespace-nowrap">
                      {data.client?.name}
                    </p>
                    <span className="flex gap-1">
                      <Button
                        size="xs"
                        className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(data.client.id);
                          ToastMessage({
                            type: "success",
                            title: "UUID copied",
                            description: `Client ID ${data.client.id} copied to clipboard.`,
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
                          setSelectedItem(data.client.id);
                          setViewClient(true);
                        }}
                        aria-label="View"
                      >
                        <Eye />
                      </Button>
                    </span>
                  </div>
                  <div className="font-semibold">Seller</div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate max-w-25 overflow-hidden whitespace-nowrap">
                      {data.user?.email}
                    </p>
                    <span className="flex gap-1">
                      <Button
                        size="xs"
                        className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(data.user.id);
                          ToastMessage({
                            type: "success",
                            title: "UUID copied",
                            description: `User ID ${data.user.id} copied to clipboard.`,
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
                          setSelectedItem(data.user.id);
                          setViewSeller(true);
                        }}
                        aria-label="View"
                      >
                        <Eye />
                      </Button>
                    </span>
                  </div>
                  <div className="font-semibold">Warehouse</div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate max-w-25 overflow-hidden whitespace-nowrap">
                      {data.warehouse?.name}
                    </p>
                    <span className="flex gap-1">
                      <Button
                        size="xs"
                        className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(data.warehouse.id);
                          ToastMessage({
                            type: "success",
                            title: "UUID copied",
                            description: `Warehouse ID ${data.warehouse.id} copied to clipboard.`,
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
                          setSelectedItem(data.warehouse.id);
                          setViewWarehouse(true);
                        }}
                        aria-label="View"
                      >
                        <Eye />
                      </Button>
                    </span>
                  </div>
                  <div className="font-semibold">Status</div>
                  <div className="truncate">{data.status}</div>
                  <div className="font-semibold">SubTotal</div>
                  <div className="truncate">${data.total}</div>
                  {(role === "ROLE_ADMIN" || role === "ROLE_SELLER") && (
                    <>
                      <div className="font-semibold">Order</div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="xs"
                          variant="ghost"
                          className="cursor-pointer w-full font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
                          disabled={data.status !== "DRAFT"}
                          onClick={() => {
                            setSelectedItem(data.id);
                            setCreateOrderLine(true);
                          }}
                          aria-label="Create order line"
                        >
                          <PackagePlus /> Create Order Line
                        </Button>
                      </div>
                      <div className="font-semibold">Invoice</div>
                      <div className="flex items-center justify-end gap-1">
                        <span className="flex gap-1">
                          <Button
                            size="xs"
                            className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                            variant="ghost"
                            disabled={data.status !== "DRAFT"}
                            onClick={() => {
                              setSelectedItem(data.id);
                              setCreateInvoice(true);
                            }}
                            aria-label="Create invoice"
                          >
                            <Printer /> Generate Invoice
                          </Button>

                          <Button
                            size="xs"
                            className="cursor-pointer font-medium items-center text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                            variant="ghost"
                            disabled={data.status === "DRAFT"}
                            onClick={() => {
                              setSelectedItem(data.id);
                              setViewInvoice(true);
                            }}
                            aria-label={
                              data.status !== "CONFIRMED"
                                ? "View invoice"
                                : "Pay invoice"
                            }
                          >
                            {data.status !== "CONFIRMED" ? (
                              <Eye />
                            ) : (
                              <HandCoins />
                            )}
                          </Button>
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Separator className="mt-3" />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-primary/80">
              🚨 No Orders found 🚨
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

      <Sheet
        open={viewOrder}
        onOpenChange={(open) => {
          if (!open) {
            fetchData(page, size, sortField, sortDirection);
            setViewOrder(false);
          }
        }}
      >
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewOrder orderId={selectedItem} isDeleted={isDeleted} />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={updateOrder} onOpenChange={(open) => setUpdateOrder(open)}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <UpdateOrder
              orderId={selectedItem}
              onDone={() => fetchData(page, size, sortField, sortDirection)}
            />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={viewClient} onOpenChange={setViewClient}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewClient
              clientId={selectedItem}
              isDeleted={false}
              viewDeletedDetails={true}
            />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={viewSeller} onOpenChange={setViewSeller}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewUser
              userId={selectedItem}
              isDeleted={false}
              viewDeletedDetails={true}
            />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={viewWarehouse} onOpenChange={setViewWarehouse}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewWarehouse
              warehouseId={selectedItem}
              isDeleted={false}
              viewDeletedDetails={true}
            />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={createInvoice} onOpenChange={setCreateInvoice}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <CreateInvoice
              orderId={selectedItem}
              onCreate={() => fetchData(page, size, sortField, sortDirection)}
            />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={createOrderLine} onOpenChange={setCreateOrderLine}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <CreateOrderLine
              orderId={selectedItem}
              onDone={() => fetchData(page, size, sortField, sortDirection)}
            />
          )}
        </SheetContent>
      </Sheet>
      <Sheet
        open={viewInvoice}
        onOpenChange={(open) => {
          if (!open) {
            fetchData(page, size, sortField, sortDirection);
            setViewInvoice(false);
          }
        }}
      >
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewInvoice invoiceId={selectedItem} isDeleted={false} />
          )}
        </SheetContent>
      </Sheet>
    </Card>
  );
};
