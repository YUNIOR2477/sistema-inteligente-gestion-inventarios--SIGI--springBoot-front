import { useEffect, useState } from "react";
import { useTheme } from "../Theme-provider";
import ToastMessage from "../ToastMessage";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { ApiError, ApiResponsePaginated } from "@/types/Response";
import { Eye } from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";
import type { Notification } from "@/types/Notification";
import { ViewNotification } from "./ViewNotification";
import { sizeOptions, sortDirections } from "@/types/Request";
import { Button } from "@/components/ui/button";
import { TableToolbar } from "../TableToolBar";
import { TablePagination } from "../TablePaginationFooter";

const filterList = [
  { value: "all", label: "All" },
  { value: "title", label: "Title" },
  { value: "unread", label: "Unread" },
];

const sortFields = [
  { value: "title", label: "Title" },
  { value: "isRead", label: "IsRead" },
  { value: "createdAt", label: "Created At" },
];

export const NotificationTable = () => {
  const {
    fetchAllNotifications,
    fetchANotificationsByTitle,
    fetchCountUnread,
    fetchNotificationsUnread,
    handleMarkAllAsReadNotifications,
    isLoading,
  } = useNotificationStore();

  const [dataList, setDataList] = useState<Notification[]>([]);
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
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    void fetchData(0, size, sortField, sortDirection);
    void updateUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, sortField, sortDirection]);

  const updateUnreadCount = async () => {
    try {
      const response = await fetchCountUnread();
      if (response) setUnreadCount(response.data);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      ToastMessage({
        type: "error",
        title: apiError.title,
        description: apiError.description,
      });
    }
  };

  const applyPaginatedResponse = (
    response: ApiResponsePaginated<Notification> | null,
  ) => {
    if (response) {
      const { content, totalPages, totalElements } = response.data;
      setDataList(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setSizeHidden(false);
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
      if (filter === "all" || filter === "unread" || (filter !== "all" && !q)) {
        const response =
          filter === "all"
            ? await fetchAllNotifications({
                page: pageNumber,
                size: pageSize,
                sortField: sortFieldParam,
                sortDirection: sortDirectionParam,
              })
            : await fetchNotificationsUnread({
                page: pageNumber,
                size: pageSize,
                sortField: sortFieldParam,
                sortDirection: sortDirectionParam,
              });
        setSearchInput("");
        applyPaginatedResponse(response);
      } else if (filter === "title" && q) {
        const response = await fetchANotificationsByTitle({
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

  const handleMarkAllAsRead = async () => {
    try {
      const response = await handleMarkAllAsReadNotifications();
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message,
          description: "All notifications marked as read.",
        });
        await fetchData(page, size, sortField, sortDirection);
        await updateUnreadCount();
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      ToastMessage({
        type: "error",
        title: apiError.title,
        description: apiError.description,
      });
    }
  };

  const handleSearch = async () => {
    await fetchData(0, size, sortField, sortDirection);
  };

  const handleNextPage = async () => {
    if (page < totalPages - 1)
      await fetchData(page + 1, size, sortField, sortDirection);
  };

  const handlePrevPage = async () => {
    if (page > 0) await fetchData(page - 1, size, sortField, sortDirection);
  };

  const disablePagination = totalElements < size;

  return (
    <Card
      className={`w-full p-6 bg-background ${theme === "system" ? "bg-gray-950/70" : ""}`}
    >
      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-4 items-center">
          <p className="text-sm text-primary/80">Unread: {unreadCount}</p>
          <Button
            onClick={handleMarkAllAsRead}
            variant="ghost"
            className="cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80"
            disabled={unreadCount === 0 || isLoading}
            aria-label="Mark all as read"
          >
            Mark All as Read
          </Button>
        </div>
      </div>

      <TableToolbar
        filter={filter}
        onFilterChange={setFilter}
        filterOptions={filterList}
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
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-center">Title</th>
                <th className="text-center">Message</th>
                <th className="text-center">Create At</th>
                <th className="text-center">Is Read</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataList && dataList.length > 0 ? (
                dataList.map((data) => (
                  <tr key={data.id}>
                    <td className="text-center text-xs sm:text-sm truncate max-w-30">
                      {data.title}
                    </td>
                    <td className="text-center text-xs sm:text-sm truncate max-w-30">
                      {data.message}
                    </td>
                    <td className="text-center text-xs sm:text-sm truncate max-w-30">
                      {data.createdAt}
                    </td>
                    <td className="text-center text-xs sm:text-sm truncate max-w-30">
                      {data.isRead ? "✅ Read" : "🔔 Unread"}
                    </td>
                    <td className="flex flex-wrap justify-center items-center gap-2 p-2">
                      <Button
                        size="sm"
                        variant={"ghost"}
                        className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                        onClick={() => {
                          setSelectedItem(data.id);
                          setViewOpen(true);
                        }}
                        aria-label="View notification"
                      >
                        <Eye /> <span className="hidden sm:inline">View</span>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-primary/80">
                    🚨 No Notifications found 🚨
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-3 bg-background/40 p-2">
          {dataList && dataList.length > 0 ? (
            dataList.map((data) => (
              <div key={data.id} className="p-3 bg-card rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-primary/80 truncate">
                    {data.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="cursor-pointer font-medium text-blue-500 border border-blue-500 hover:border-primary/80 hover:text-primary/80"
                      onClick={() => {
                        setSelectedItem(data.id);
                        setViewOpen(true);
                      }}
                      aria-label="View"
                    >
                      <Eye />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="font-semibold">Message</div>
                  <div className="truncate">{data.message}</div>
                  <div className="font-semibold">Create At</div>
                  <div className="truncate">{data.createdAt}</div>
                  <div className="font-semibold">Is Read</div>
                  <div>{data.isRead ? "✅ Read" : "🔔 Unread"}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-primary/80">
              🚨 No Notifications found 🚨
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
        open={viewOpen}
        onOpenChange={(open) => {
          setViewOpen(open);
          if (!open) void fetchData(page, size, sortField, sortDirection);
        }}
      >
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && <ViewNotification notificationId={selectedItem} />}
        </SheetContent>
      </Sheet>
    </Card>
  );
};
