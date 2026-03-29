// InvoiceTable.tsx
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
import { ViewInvoice } from "./ViewInvoice";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { UpdateInvoice } from "./UpdateInvoice";
import { ConfirmDeleteInvoice } from "./ConfirmDeleteInvoice";
import { useUserStore } from "@/store/useUserStore";
import type {
  ApiError,
  ApiResponse,
  ApiResponsePaginated,
} from "@/types/Response";
import { ConfirmRestoreInvoice } from "./ConfirmRestoreInvoice";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import type { Invoice } from "@/types/Invoice";
import { Copy, Eye, HandCoins, NotebookPen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ViewClient } from "../client/ViewClient";
import { ViewOrder } from "../order/ViewOrder";
import { sizeOptions, sortDirections } from "@/types/Request";
import { TableToolbar } from "../TableToolBar";
import { TablePagination } from "../TablePaginationFooter";

const filterList = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
  { value: "clientId", label: "Client" },
  { value: "number", label: "Number" },
  { value: "status", label: "Status" },
];

const filterListDeleted = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
  { value: "number", label: "Number" },
];

const sortFields = [
  { value: "client.name", label: "Client" },
  { value: "number", label: "Number" },
  { value: "status", label: "Status" },
  { value: "total", label: "Total" },
  { value: "createdAt", label: "Created At" },
];

interface TableProps {
  isDeleted: boolean;
}

export const InvoiceTable = ({ isDeleted }: TableProps) => {
  const {
    fetchAllInvoices,
    fetchAllDeletedInvoices,
    fetchDeletedInvoiceByNumber,
    fetchInvoiceByNumber,
    fetchInvoicesByClient,
    fetchInvoicesByStatus,
    fetchInvoiceById,
    fetchDeletedInvoiceById,
    isLoading,
  } = useInvoiceStore();

  const { userProfileResponse } = useUserStore();
  const [dataList, setDataList] = useState<Invoice[]>([]);
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
  const [viewInvoice, setViewInvoice] = useState(false);
  const [updateInvoice, setUpdateInvoice] = useState(false);
  const [viewClient, setViewClient] = useState(false);
  const [viewOrder, setViewOrder] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const role = userProfileResponse?.data.role;

  useEffect(() => {
    fetchData(0, size, sortField, sortDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, sortField, sortDirection]);

  const applyPaginatedResponse = (
    response: ApiResponsePaginated<Invoice> | null,
  ) => {
    if (response) {
      const { content, totalPages, totalElements } = response.data;
      setDataList(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setSizeHidden(false);
    }
  };

  const applyCurrentResponse = (response: ApiResponse<Invoice> | null) => {
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
          ? await fetchAllDeletedInvoices({
              page: pageNumber,
              size: pageSize,
              sortField: sortFieldParam,
              sortDirection: sortDirectionParam,
            })
          : await fetchAllInvoices({
              page: pageNumber,
              size: pageSize,
              sortField: sortFieldParam,
              sortDirection: sortDirectionParam,
            });
        setSearchInput("");
        applyPaginatedResponse(response);
      } else if ((filter === "id" || filter === "number") && q) {
        const response =
          isDeleted && filter === "id"
            ? await fetchDeletedInvoiceById(q)
            : isDeleted && filter === "number"
              ? await fetchDeletedInvoiceByNumber(q)
              : filter === "id"
                ? await fetchInvoiceById(q)
                : await fetchInvoiceByNumber(q);
        applyCurrentResponse(response);
      } else if ((filter === "clientId" || filter === "status") && q) {
        const response =
          filter === "clientId"
            ? await fetchInvoicesByClient({
                page: pageNumber,
                size: pageSize,
                sortField: sortFieldParam,
                sortDirection: sortDirectionParam,
                searchValue: q,
              })
            : await fetchInvoicesByStatus(q, {
                page: pageNumber,
                size: pageSize,
                sortField: sortFieldParam,
                sortDirection: sortDirectionParam,
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
                <TableHead className="text-center">Order</TableHead>
                <TableHead className="text-center">Client</TableHead>
                <TableHead className="text-center">Number</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">SubTotal</TableHead>
                <TableHead className="text-center">Tax</TableHead>
                <TableHead className="text-center">Total</TableHead>
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
                              description: `Invoice ID ${data.id} copied to clipboard.`,
                            });
                          }}
                          aria-label="Copy id"
                        >
                          <Copy />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-25 overflow-hidden whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{data.order?.id}</span>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              setSelectedItem(data.order.id);
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
                              navigator.clipboard.writeText(data.order.id);
                              ToastMessage({
                                type: "success",
                                title: "UUID copied",
                                description: `Order ID ${data.order.id} copied to clipboard.`,
                              });
                            }}
                            aria-label="Copy order id"
                          >
                            <Copy />
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-40 overflow-hidden whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{data.client?.name}</span>
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
                            variant="ghost"
                            className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                            onClick={() => {
                              navigator.clipboard.writeText(data.client.id);
                              ToastMessage({
                                type: "success",
                                title: "UUID copied",
                                description: `Client ID ${data.client.id} copied to clipboard.`,
                              });
                            }}
                            aria-label="Copy client id"
                          >
                            <Copy />
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {data.number}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {data.status}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      ${data.subtotal}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      ${data.tax}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      ${data.total}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap justify-center gap-2">
                        <Button
                          size="sm"
                          variant={"ghost"}
                          className={`cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80 ${isDeleted ? "hidden" : ""}`}
                          onClick={() => {
                            setSelectedItem(data.id);
                            setViewInvoice(true);
                          }}
                          aria-label={
                            data.status !== "ISSUED"
                              ? "View invoice"
                              : "Pay invoice"
                          }
                        >
                          {data.status === "ISSUED" &&
                          (role === "ROLE_ADMIN" || role === "ROLE_SELLER") ? (
                            <>
                              <HandCoins />{" "}
                              <span className="hidden sm:inline">Pay</span>
                            </>
                          ) : (
                            <>
                              <Eye />{" "}
                              <span className="hidden sm:inline">View</span>
                            </>
                          )}
                        </Button>

                        <div
                          className={`${isDeleted === true ? "hidden" : ""} flex flex-wrap justify-center gap-2`}
                        >
                          {(role === "ROLE_ADMIN" ||
                            role === "ROLE_SELLER") && (
                            <Button
                              size="sm"
                              variant={"ghost"}
                          disabled={data.status !== "ISSUED"}
                              className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
                              onClick={() => {
                                setSelectedItem(data.id);
                                setUpdateInvoice(true);
                              }}
                              aria-label="Edit invoice"
                            >
                              <NotebookPen />{" "}
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          )}
                          {role === "ROLE_ADMIN" && (
                            <ConfirmDeleteInvoice
                              invoiceId={data.id}
                              onDone={() =>
                                fetchData(page, size, sortField, sortDirection)
                              }
                            />
                          )}
                        </div>

                        {role === "ROLE_ADMIN" && isDeleted === true && (
                          <ConfirmRestoreInvoice
                            invoiceId={data.id}
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
                    🚨 No Invoices found 🚨
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
                          description: `Invoice ID ${data.id} copied to clipboard.`,
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
                        setViewInvoice(true);
                      }}
                      aria-label={
                        data.status !== "ISSUED"
                          ? "View invoice"
                          : "Pay invoice"
                      }
                    >
                      {data.status !== "ISSUED" ? <Eye /> : <HandCoins />}
                    </Button>

                    <div
                      className={`${isDeleted === true ? "hidden" : ""} flex justify-center gap-2`}
                    >
                      {(role === "ROLE_ADMIN" || role === "ROLE_SELLER") && (
                        <Button
                          size="sm"
                          variant={"ghost"}
                          disabled={data.status !== "ISSUED"}
                          className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
                          onClick={() => {
                            setSelectedItem(data.id);
                            setUpdateInvoice(true);
                          }}
                          aria-label="Edit invoice"
                        >
                          <NotebookPen />
                        </Button>
                      )}

                      {role === "ROLE_ADMIN" && (
                        <ConfirmDeleteInvoice
                          invoiceId={data.id}
                          isMobile
                          onDone={() =>
                            fetchData(page, size, sortField, sortDirection)
                          }
                        />
                      )}
                    </div>

                    {role === "ROLE_ADMIN" && isDeleted === true && (
                      <ConfirmRestoreInvoice
                        invoiceId={data.id}
                        onDone={() =>
                          fetchData(page, size, sortField, sortDirection)
                        }
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 items-center text-xs">
                  <div className="font-semibold">Order</div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate max-w-25 overflow-hidden whitespace-nowrap">
                      {data.order?.id}
                    </p>
                    <span className="flex gap-1">
                      <Button
                        size="xs"
                        variant="ghost"
                        className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                        onClick={() => {
                          navigator.clipboard.writeText(data.order.id);
                          ToastMessage({
                            type: "success",
                            title: "UUID copied",
                            description: `Order ID ${data.order.id} copied to clipboard.`,
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
                          setSelectedItem(data.order.id);
                          setViewOrder(true);
                        }}
                        aria-label="View"
                      >
                        <Eye />
                      </Button>
                    </span>
                  </div>

                  <div className="font-semibold">Client</div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate max-w-25 overflow-hidden whitespace-nowrap">
                      {data.client?.name}
                    </p>
                    <span className="flex gap-1">
                      <Button
                        size="xs"
                        variant="ghost"
                        className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
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
                        variant="ghost"
                        className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
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

                  <div className="font-semibold">Number</div>
                  <div className="truncate">{data.number}</div>

                  <div className="font-semibold">Status</div>
                  <div className="truncate">{data.status}</div>

                  <div className="font-semibold">Total</div>
                  <div className="truncate">${data.total}</div>
                </div>

                <Separator className="mt-3" />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-primary/80">
              🚨 No Invoices found 🚨
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

      <Sheet open={viewInvoice} onOpenChange={setViewInvoice}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewInvoice invoiceId={selectedItem} isDeleted={isDeleted} />
          )}
        </SheetContent>
      </Sheet>

      <Sheet
        open={updateInvoice}
        onOpenChange={(open) => setUpdateInvoice(open)}
      >
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <UpdateInvoice
              invoiceId={selectedItem}
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
            <ViewClient isDeleted={false} clientId={selectedItem} />
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
    </Card>
  );
};
