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

import { Send, UserCircle, MailPlus } from "lucide-react";
import { sizeOptions, sortDirections } from "@/types/Request";
import type { ApiError, ApiResponsePaginated } from "@/types/Response";
import { useChatRoomStore } from "@/store/useChatRoomStore";
import type { ChatRoom } from "@/types/ChatRoom";
import { CreateRoom } from "./CreateRoom";
import { ViewChat } from "./ViewChat";
import { ManageParticipants } from "./AddParticipants";
import { TableToolbar } from "../TableToolBar";
import { TablePagination } from "../TablePaginationFooter";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ConfirmDeleteChatRoom } from "./ConfirmDeleteChatRoom";

const filterList = [
  { value: "all", label: "All" },
  { value: "name", label: "Name" },
  { value: "id", label: "Id" },
];

const sortFields = [
  { value: "name", label: "Name" },
  { value: "createdAt", label: "Created At" },
];

export const ChatTable = () => {
  const {
    fetchChatRoomById,
    fetchChatRoomByName,
    fetchChatRoomByUserId,
    isLoading,
  } = useChatRoomStore();

  const [dataList, setDataList] = useState<ChatRoom[]>([]);
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
  const [viewChatRoom, setViewChatRoom] = useState(false);
  const [createChatRoom, setCreateChatRoom] = useState(false);
  const [addUsers, setAddUsers] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    void fetchData(0, size, sortField, sortDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, sortField, sortDirection]);

  const applyPaginatedResponse = (
    response: ApiResponsePaginated<ChatRoom> | null,
  ) => {
    if (response) {
      const { content, totalPages, totalElements } = response.data;
      setDataList(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setSizeHidden(false);
    }
  };

  const applyCurrentResponse = (response: ChatRoom | null) => {
    if (response) {
      setDataList([response as ChatRoom]);
      setTotalPages(1);
      setTotalElements(1);
      setSizeHidden(true);
    }
  };

  const fetchData = async (
    pageNumber: number,
    pageSize: number,
    sField?: string,
    sDirection?: string,
  ) => {
    try {
      const q = (searchInput || "").trim();
      if (filter === "all" || (filter !== "all" && !q)) {
        const response = await fetchChatRoomByUserId({
          page: pageNumber,
          size: pageSize,
          sortField: sField,
          sortDirection: sDirection,
        });
        setSearchInput("");
        applyPaginatedResponse(response);
      } else if (filter === "name" && q) {
        const response = await fetchChatRoomByName({
          page: pageNumber,
          size: pageSize,
          sortField: sField,
          sortDirection: sDirection,
          searchValue: q,
        });
        applyPaginatedResponse(response);
      } else if (filter === "id" && q) {
        const response = await fetchChatRoomById(q);
        applyCurrentResponse(response?.data ?? null);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setDataList([]);
      ToastMessage({
        type: "error",
        title: apiError?.title ?? "Error",
        description: apiError?.description ?? "Failed to fetch chat rooms.",
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
      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-3 items-center">
          <Button
            onClick={() => setCreateChatRoom(true)}
            variant="ghost"
            className="cursor-pointer font-medium text-green-500 border-2 border-green-500 hover:border-primary"
            aria-label="Create room"
          >
            <MailPlus />{" "}
            <span className="hidden sm:inline">Create Chat Room</span>
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
          <Table className="min-w-full sm:min-w-200">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Id</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Participants</TableHead>
                <TableHead className="text-center">Created At</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {dataList && dataList.length > 0 ? (
                dataList.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {room.id}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {room.name}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {Array.isArray(room.participantEmails)
                        ? room.participantEmails.slice(0, 3).join(", ")
                        : "—"}
                    </TableCell>

                    <TableCell className="text-center text-xs sm:text-sm truncate max-w-30 overflow-hidden whitespace-nowrap">
                      {room.createdAt}
                    </TableCell>

                    <TableCell className="flex flex-wrap justify-center gap-2">
                      <Button
                        size="sm"
                        variant={"ghost"}
                        className="cursor-pointer font-medium text-green-600 border-2 border-green-600 hover:border-primary"
                        onClick={() => {
                          setSelectedItem(room.id);
                          setViewChatRoom(true);
                        }}
                        aria-label="View chat"
                      >
                        <Send /> <span className="hidden sm:inline">Chat</span>
                      </Button>

                      <Button
                        size="sm"
                        variant={"ghost"}
                        className="cursor-pointer font-medium text-blue-600 border-2 border-blue-600 hover:border-primary"
                        onClick={() => {
                          setSelectedItem(room.id);
                          setAddUsers(true);
                        }}
                        aria-label="Add participants"
                      >
                        <UserCircle />
                        <span className="hidden sm:inline">Participants</span>
                      </Button>

                      <ConfirmDeleteChatRoom
                        chatRoomId={room.id}
                        onDone={() =>
                          fetchData(page, size, sortField, sortDirection)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-primary/80"
                  >
                    🚨 No Chats found 🚨
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="sm:hidden space-y-3 bg-background/40 p-2">
          {dataList && dataList.length > 0 ? (
            dataList.map((room) => (
              <div key={room.id} className="p-3 bg-card rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-primary/80 truncate">
                    {room.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant={"ghost"}
                        className="cursor-pointer font-medium text-green-600 border-2 border-green-600 hover:border-primary"
                        onClick={() => {
                          setSelectedItem(room.id);
                          setViewChatRoom(true);
                        }}
                        aria-label="View chat"
                      >
                        <Send /> <span className="hidden sm:inline">Chat</span>
                      </Button>
                     <Button
                        size="sm"
                        variant={"ghost"}
                        className="cursor-pointer font-medium text-blue-600 border-2 border-blue-600 hover:border-primary"
                        onClick={() => {
                          setSelectedItem(room.id);
                          setAddUsers(true);
                        }}
                        aria-label="Add participants"
                      >
                        <UserCircle />
                        <span className="hidden sm:inline">Participants</span>
                      </Button>
                     <ConfirmDeleteChatRoom
                        chatRoomId={room.id}
                        isMobile
                        onDone={() =>
                          fetchData(page, size, sortField, sortDirection)
                        }
                      />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="font-semibold">Participants</div>
                  <div className="truncate">
                    {Array.isArray(room.participantEmails)
                      ? room.participantEmails.slice(0, 3).join(", ")
                      : "—"}
                  </div>
                  <div className="font-semibold">Created At</div>
                  <div className="truncate">{room.createdAt}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-primary/80">
              🚨 No Chats found 🚨
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

      <Sheet open={viewChatRoom} onOpenChange={setViewChatRoom}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && <ViewChat chatRoomId={selectedItem} />}
        </SheetContent>
      </Sheet>

      <Sheet
        open={createChatRoom}
        onOpenChange={(open) => {
          if (!open) {
            void fetchData(page, size, sortField, sortDirection);
            setCreateChatRoom(false);
          }
        }}
      >
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          <CreateRoom />
        </SheetContent>
      </Sheet>

      <Sheet open={addUsers} onOpenChange={setAddUsers}>
        <SheetContent
          side="right"
          className={`flex-1 overflow-y-auto p-2 ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          {selectedItem && <ManageParticipants chatRoomId={selectedItem} />}
        </SheetContent>
      </Sheet>
    </Card>
  );
};
