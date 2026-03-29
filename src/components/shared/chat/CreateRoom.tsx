import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ToastMessage from "../ToastMessage";
import { useTheme } from "../Theme-provider";
import { Separator } from "@/components/ui/separator";
import { FilePen, FolderInput, XCircle } from "lucide-react";
import type { ApiError } from "@/types/Response";
import { useChatRoomStore } from "@/store/useChatRoomStore";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/useUserStore";
import type { User } from "@/types/User";

type UserOption = { id: string; name: string };

export const CreateRoom = () => {
  const { handleCreateRoom, isLoading } = useChatRoomStore();
  const { fetchUsersByName } = useUserStore();
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);
  const [participantIds, setParticipantIds] = useState<string[]>([]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserOption[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticipantIds(selectedUsers.map((u) => u.id));
  }, [selectedUsers]);

  const handleSearch = async (q: string) => {
    setQuery(q);
    setResults([]);
    if (!q || q.trim().length < 2) {
      setResults([]);
      return;
    }
    try {
      const res = await fetchUsersByName({ searchValue: q.trim(), page: 0, size: 50 });
      const options: UserOption[] = (res?.data?.content ?? []).map((p: User) => ({
        id: p.id,
        name: (p.name ?? `${p.surname ?? ""} ${p.email ?? ""}`.trim()) || p.id,
      }));
      setResults(options);
    } catch (err) {
      console.error("Search users error", err);
      setResults([]);
    } 
  };

  const addUser = (u: UserOption) => {
    setSelectedUsers((prev) => {
      if (prev.some((p) => p.id === u.id)) return prev;
      return [...prev, u];
    });
    setQuery("");
    setResults([]);
  };

  const removeUser = (id: string) => {
    setSelectedUsers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const roomName = (name || "").trim();
    const uniqueIds = Array.from(new Set(participantIds.map((id) => String(id).trim()).filter(Boolean)));

    if (!roomName) {
      ToastMessage({ type: "error", title: "Validation", description: "Please enter a room name." });
      return;
    }
    if (uniqueIds.length === 0) {
      ToastMessage({ type: "error", title: "Validation", description: "Please select at least one participant." });
      return;
    }

    try {
      const payload = { name: roomName, participantIds: uniqueIds };
      console.debug("CreateRoom payload:", payload);
      const response = await handleCreateRoom(payload);
      if (response) {
        ToastMessage({
          type: "success",
          title: response.message ?? "Room created",
          description: "Chat room created successfully.",
        });
        // reset form
        setName("");
        setSelectedUsers([]);
        setQuery("");
        setResults([]);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      ToastMessage({
        type: "error",
        title: apiError?.title ?? "Error",
        description: apiError?.description ?? "Failed to create room.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""}`}
        >
          <FolderInput />
          Create Chat Room
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Fill in the chat room details below. Click save when you are done.
        </SheetDescription>
      </SheetHeader>

      <Separator />

      <div className="grid flex-1 auto-rows-min gap-5 px-4 py-2">
        <div className="grid gap-2">
          <Label className="text-[13px]" htmlFor="room-name">
            Room Name
          </Label>
          <Input
            id="room-name"
            type="text"
            placeholder="Enter the room name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-[13px]" htmlFor="participants-search">
            Participants
          </Label>

          <Input
            id="participants-search"
            type="text"
            placeholder="Search users by name (min 2 chars)"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search users"
          />

          {results.length > 0 && (
            <div className="border rounded mt-2 max-h-48 overflow-y-auto bg-background">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="p-2 cursor-pointer text-xs hover:bg-primary/10 flex justify-between items-center"
                  onClick={() => addUser(r)}
                >
                  <span>{r.name}</span>
                  <span className="text-[11px] text-primary/60">ID: {r.id}</span>
                </div>
              ))}
            </div>
          )}

          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded text-xs">
                  <span>{u.name}</span>
                  <button
                    type="button"
                    onClick={() => removeUser(u.id)}
                    className="text-red-500 ml-1"
                    aria-label={`Remove ${u.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SheetFooter>
        <Button
          type="submit"
          disabled={isLoading}
          variant={"ghost"}
          className={`cursor-pointer font-medium text-green-500 border border-green-500 hover:border-primary/80 hover:text-primary/80`}
        >
          <FilePen /> {isLoading ? "Saving..." : "Save Room"}
        </Button>

        <SheetClose asChild>
          <Button
            variant={"ghost"}
            className="cursor-pointer text-red-500 font-medium border border-red-500 hover:border-primary/80 hover:text-primary/80"
          >
            <XCircle />
            Cancel
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
};