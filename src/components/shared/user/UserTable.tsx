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

import { ViewUser } from "./ViewUser";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { UpdateUser } from "./UpdateUser";
import { ConfirmDeleteUser } from "./ConfirmDeleteUser";
import type {
  ApiError,
  ApiResponse,
  ApiResponsePaginated,
} from "@/types/Response";
import { ConfirmRestoreUser } from "./ConfirmRestoreUser";
import { useUserStore } from "@/store/useUserStore";
import type { User } from "@/types/User";
import {
  Copy,
  Eye,
  NotebookPen,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { sizeOptions, sortDirections } from "@/types/Request";
import { TableToolbar } from "../TableToolBar";
import { TablePagination } from "../TablePaginationFooter";

const filterList = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
  { value: "email", label: "Email" },
];

const filterListDeleted = [
  { value: "all", label: "All" },
  { value: "id", label: "Id" },
  { value: "name", label: "Name" },
];

const sortFields = [
  { value: "sku", label: "Sku" },
  { value: "name", label: "Name" },
  { value: "category", label: "Category" },
  { value: "unit", label: "Unit" },
  { value: "price", label: "price" },
  { value: "createdAt", label: "Created At" },
];

interface TableProps {
  isDeleted: boolean;
}

export const UserTable = ({ isDeleted }: TableProps) => {
  const {
    fetchUserById,
    fetchDeletedUserById,
    fetchActiveUsers,
    fetchInactiveUsers,
    fetchDeletedUsersByName,
    fetchUserByEmail,
    isLoading,
  } = useUserStore();

  const { userProfileResponse } = useUserStore();
  const [dataList, setDataList] = useState<User[]>([]);
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
    response: ApiResponsePaginated<User> | null,
  ) => {
    if (response) {
      const { content, totalPages, totalElements } = response.data;
      setDataList(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setSizeHidden(false);
    }
  };

  const applyCurrentResponse = (response: ApiResponse<User> | null) => {
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
          ? await fetchInactiveUsers({
              page: pageNumber,
              size: pageSize,
              sortDirection: sortDirectionParam,
              sortField: sortFieldParam,
            })
          : await fetchActiveUsers({
              page: pageNumber,
              size: pageSize,
              sortDirection: sortDirectionParam,
              sortField: sortFieldParam,
            });
        setSearchInput("");
        applyPaginatedResponse(response);
      } else if ((filter === "id" || filter === "email") && q) {
        const response = isDeleted
          ? await fetchDeletedUserById(q)
          : filter === "id"
            ? await fetchUserById(q)
            : await fetchUserByEmail(q);
        applyCurrentResponse(response);
      } else if (filter === "name" && q) {
        const response = await fetchDeletedUsersByName({
          page: pageNumber,
          size: pageSize,
          sortDirection: sortDirectionParam,
          sortField: sortFieldParam,
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
                <TableHead className="text-center">Surname</TableHead>
                <TableHead className="text-center">Phone number</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Role</TableHead>
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
                          className="cursor-pointer font-bold text-gray-500 border border-gray-500 hover:border-primary"
                          onClick={() => {
                            navigator.clipboard.writeText(data.id);
                            ToastMessage({
                              type: "success",
                              title: "UUID copied",
                              description: `User ID ${data.id} copied to clipboard.`,
                            });
                          }}
                          aria-label="Copy id"
                        >
                          <Copy />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {data.name}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {data.surname}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {data.phoneNumber}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-40 overflow-hidden whitespace-nowrap">
                      {data.email}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {data.role}
                    </TableCell>

                    <TableCell className="flex flex-wrap justify-center gap-2">
                      <Button
                        size="sm"
                        variant={"ghost"}
                        className="cursor-pointer font-bold text-blue-600 border border-blue-600 hover:border-primary"
                        onClick={() => {
                          setSelectedItem(data.id);
                          setViewOpen(true);
                        }}
                        aria-label="View user"
                      >
                        <Eye /> <span className="hidden sm:inline">View</span>
                      </Button>

                      <div
                        className={`${isDeleted === true ? "hidden" : ""} flex flex-wrap justify-center gap-2`}
                      >
                        {role === "ROLE_ADMIN" && (
                          <Button
                            size="sm"
                            variant={"ghost"}
                            className="cursor-pointer font-bold text-green-600 border border-green-600 hover:border-primary"
                            onClick={() => {
                              setSelectedItem(data.id);
                              setUpdateOpen(true);
                            }}
                            aria-label="Edit user"
                          >
                            <NotebookPen />{" "}
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        )}

                        {role === "ROLE_ADMIN" && (
                          <ConfirmDeleteUser
                            userId={data.id}
                            onDone={() =>
                              fetchData(page, size, sortField, sortDirection)
                            }
                          />
                        )}
                      </div>

                      {role === "ROLE_ADMIN" && isDeleted === true && (
                        <ConfirmRestoreUser
                          userId={data.id}
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
                    🚨 No Users found 🚨
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
                      className="cursor-pointer font-bold text-gray-500 border border-gray-500 hover:border-primary"
                      onClick={() => {
                        navigator.clipboard.writeText(data.id);
                        ToastMessage({
                          type: "success",
                          title: "UUID copied",
                          description: `User ID ${data.id} copied to clipboard.`,
                        });
                      }}
                      aria-label="Copy id"
                    >
                      <Copy />
                    </Button>
                    <Button
                      size="sm"
                      variant={"ghost"}
                      className="cursor-pointer font-bold text-blue-600 border border-blue-600 hover:border-primary"
                      onClick={() => {
                        setSelectedItem(data.id);
                        setViewOpen(true);
                      }}
                      aria-label="View user"
                    >
                      <Eye />
                    </Button>

                    <div
                      className={`${isDeleted === true ? "hidden" : ""} flex justify-center gap-2`}
                    >
                      {role === "ROLE_ADMIN" && (
                        <Button
                          size="sm"
                          variant={"ghost"}
                          className="cursor-pointer font-bold text-green-600 border border-green-600 hover:border-primary"
                          onClick={() => {
                            setSelectedItem(data.id);
                            setUpdateOpen(true);
                          }}
                          aria-label="Edit user"
                        >
                          <NotebookPen />{" "}
                        </Button>
                      )}

                      {role === "ROLE_ADMIN" && (
                        <ConfirmDeleteUser
                          userId={data.id}
                          isMobile
                          onDone={() =>
                            fetchData(page, size, sortField, sortDirection)
                          }
                        />
                      )}
                    </div>

                    {role === "ROLE_ADMIN" && isDeleted === true && (
                      <ConfirmRestoreUser
                        userId={data.id}
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
                  <div className="font-semibold">Surname</div>
                  <div className="truncate">{data.surname}</div>
                  <div className="font-semibold">Phone number</div>
                  <div className="truncate">{data.phoneNumber}</div>
                  <div className="font-semibold">Email</div>
                  <div className="truncate">{data.email}</div>
                  <div className="font-semibold">Role</div>
                  <div className="truncate">{data.role}</div>
                </div>

                <Separator className="mt-3" />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-primary/80">
              🚨 No Users found 🚨
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
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <ViewUser userId={selectedItem} isDeleted={isDeleted} />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={updateOpen} onOpenChange={(open) => setUpdateOpen(open)}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && (
            <UpdateUser
              userId={selectedItem}
              onDone={() => fetchData(page, size, sortField, sortDirection)}
            />
          )}
        </SheetContent>
      </Sheet>
    </Card>
  );
};