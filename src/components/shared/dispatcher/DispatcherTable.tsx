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
import { ViewDispatcher } from "./ViewDispatcher";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { UpdateDispatcher } from "./UpdateDispatcher";
import { ConfirmDeleteDispatcher } from "./ConfirmDeleteDispatcher";
import { useUserStore } from "@/store/useUserStore";
import type {
  ApiError,
  ApiResponse,
  ApiResponsePaginated,
} from "@/types/Response";
import { ConfirmRestoreDispatcher } from "./ConfirmRestoreDispatcher";
import { useDispatcherStore } from "@/store/useDispatcherStore";
import type { Dispatcher } from "@/types/Dispatcher";
import { Copy, Eye, NotebookPen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { sizeOptions, sortDirections } from "@/types/Request";
import { TableToolbar } from "../TableToolBar";
import { TablePagination } from "../TablePaginationFooter";

const filterList = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
  { value: "name", label: "Name" },
];

const filterListDeleted = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
  { value: "name", label: "Name" },
];

const sortFields = [
  { value: "name", label: "Name" },
  { value: "identification", label: "Identification" },
  { value: "location", label: "Location" },
  { value: "email", label: "Email" },
  { value: "createdAt", label: "Created At" },
];

interface TableProps {
  isDeleted: boolean;
}

export const DispatcherTable = ({ isDeleted }: TableProps) => {
  const {
    fetchAllDispatchers,
    fetchAllDeletedDispatchers,
    fetchDeletedDispatchersByName,
    fetchDispatcherById,
    fetchDispatchersByName,
    fetchDeletedDispatcherById,
    isLoading,
  } = useDispatcherStore();

  const { userProfileResponse } = useUserStore();
  const [dataList, setDataList] = useState<Dispatcher[]>([]);
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
  const [viewDispatcher, setViewDispatcher] = useState(false);
  const [updateDispatcher, setUpdateDispatcher] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const role = userProfileResponse?.data.role;

  useEffect(() => {
    fetchData(0, size, sortField, sortDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, sortField, sortDirection]);

  const applyPaginatedResponse = (
    response: ApiResponsePaginated<Dispatcher> | null,
  ) => {
    if (response) {
      const { content, totalPages, totalElements } = response.data;
      setDataList(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setSizeHidden(false);
    }
  };

  const applyCurrentResponse = (response: ApiResponse<Dispatcher> | null) => {
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
          ? await fetchAllDeletedDispatchers({
              page: pageNumber,
              size: pageSize,
              sortField: sortFieldParam,
              sortDirection: sortDirectionParam,
            })
          : await fetchAllDispatchers({
              page: pageNumber,
              size: pageSize,
              sortField: sortFieldParam,
              sortDirection: sortDirectionParam,
            });
        setSearchInput("");
        applyPaginatedResponse(response);
      } else if (filter === "id" && q) {
        const response = isDeleted
          ? await fetchDeletedDispatcherById(q)
          : await fetchDispatcherById(q);
        applyCurrentResponse(response);
      } else if (filter === "name" && q) {
        const response = isDeleted
          ? await fetchDeletedDispatchersByName({
              page: pageNumber,
              size: pageSize,
              sortField: sortFieldParam,
              sortDirection: sortDirectionParam,
              searchValue: q,
            })
          : await fetchDispatchersByName({
              page: pageNumber,
              size: pageSize,
              sortField: sortFieldParam,
              sortDirection: sortDirectionParam,
              searchValue: q,
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
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Identification</TableHead>
                <TableHead className="text-center">Location</TableHead>
                <TableHead className="text-center">Phone</TableHead>
                <TableHead className="text-center">Email</TableHead>
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
                          size={"xs"}
                          variant={"ghost"}
                          className="cursor-pointer font-medium text-slate-500 border border-slate-500 hover:border-primary/80 hover:text-primary/80"
                          onClick={() => {
                            navigator.clipboard.writeText(data.id);
                            ToastMessage({
                              type: "success",
                              title: "UUID copied",
                              description: `Dispatcher ID ${data.id} copied to clipboard.`,
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
                      {data.identification}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-35 overflow-hidden whitespace-nowrap">
                      {data.location}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-35 overflow-hidden whitespace-nowrap">
                      {data.phone}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-35 overflow-hidden whitespace-nowrap">
                      {data.email}
                    </TableCell>

                    <TableCell className="flex flex-wrap justify-center gap-2">
                      <Button
                        size="sm"
                        variant={"ghost"}
                        className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                        onClick={() => {
                          setSelectedItem(data.id);
                          setViewDispatcher(true);
                        }}
                      >
                        <Eye /> <span className="hidden sm:inline">View</span>
                      </Button>

                      <div
                        className={`${isDeleted === true ? "hidden" : ""} flex  justify-center gap-2`}
                      >
                        {(role === "ROLE_ADMIN" ||
                          role === "ROLE_DISPATCHER") && (
                          <Button
                            size="sm"
                            variant={"ghost"}
                            className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80 "
                            onClick={() => {
                              setSelectedItem(data.id);
                              setUpdateDispatcher(true);
                            }}
                          >
                            <NotebookPen />{" "}
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        )}

                        {role === "ROLE_ADMIN" && (
                          <ConfirmDeleteDispatcher
                            dispatcherId={data.id}
                            onDone={() =>
                              fetchData(page, size, sortField, sortDirection)
                            }
                          />
                        )}
                      </div>

                      {role === "ROLE_ADMIN" && isDeleted === true && (
                        <ConfirmRestoreDispatcher
                          dispatcherId={data.id}
                          onDone={() =>
                            fetchData(page, size, sortField, sortDirection)
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-primary/80"
                  >
                    🚨 No Dispatchers found 🚨
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
                <div className="flex items-center gap-2 justify-between mb-2">
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
                          description: `Dispatcher ID ${data.id} copied to clipboard.`,
                        });
                      }}
                      aria-label="Copy id"
                    >
                      <Copy />
                    </Button>
                    <Button
                      size="sm"
                      variant={"ghost"}
                      className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                      onClick={() => {
                        setSelectedItem(data.id);
                        setViewDispatcher(true);
                      }}
                    >
                      <Eye />
                    </Button>

                    <div
                      className={`${isDeleted === true ? "hidden" : ""} flex  justify-center gap-2`}
                    >
                      {(role === "ROLE_ADMIN" ||
                        role === "ROLE_DISPATCHER") && (
                        <Button
                          size="sm"
                          variant={"ghost"}
                          className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80 "
                          onClick={() => {
                            setSelectedItem(data.id);
                            setUpdateDispatcher(true);
                          }}
                        >
                          <NotebookPen />{" "}
                        </Button>
                      )}

                      {role === "ROLE_ADMIN" && (
                        <ConfirmDeleteDispatcher
                          dispatcherId={data.id}
                          isMobile
                          onDone={() =>
                            fetchData(page, size, sortField, sortDirection)
                          }
                        />
                      )}
                    </div>

                    {role === "ROLE_ADMIN" && isDeleted === true && (
                      <ConfirmRestoreDispatcher
                        dispatcherId={data.id}
                        isMobile
                        onDone={() =>
                          fetchData(page, size, sortField, sortDirection)
                        }
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="font-semibold">Name</div>
                  <div className="truncate">{data.name}</div>
                  <div className="font-semibold">Identification</div>
                  <div className="truncate">{data.identification}</div>
                  <div className="font-semibold">Location</div>
                  <div className="truncate">{data.location}</div>
                  <div className="font-semibold">Phone</div>
                  <div className="truncate">{data.phone}</div>
                  <div className="font-semibold">Email</div>
                  <div className="truncate">{data.email}</div>
                </div>

                <Separator className="mt-3" />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-primary/80">
              🚨 No Dispatchers found 🚨
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

      <Sheet open={viewDispatcher} onOpenChange={setViewDispatcher}>
        <SheetContent
          side="right"
          className={` flex-1 overflow-y-auto p-2 ${theme === "system" ? " bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewDispatcher dispatcherId={selectedItem} isDeleted={isDeleted} />
          )}
        </SheetContent>
      </Sheet>

      <Sheet
        open={updateDispatcher}
        onOpenChange={(open) => setUpdateDispatcher(open)}
      >
        <SheetContent
          side="right"
          className={` flex-1 overflow-y-auto p-2 ${theme === "system" ? " bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <UpdateDispatcher
              dispatcherId={selectedItem}
              onDone={() => fetchData(page, size, sortField, sortDirection)}
            />
          )}
        </SheetContent>
      </Sheet>
    </Card>
  );
};
