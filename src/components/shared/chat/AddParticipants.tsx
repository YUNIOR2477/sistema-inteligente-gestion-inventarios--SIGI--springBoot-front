import { useEffect, useState } from "react";
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
import { FilePen, XCircle } from "lucide-react";
import type { ApiError } from "@/types/Response";
import { useChatRoomStore } from "@/store/useChatRoomStore";
import { useUserStore } from "@/store/useUserStore";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/types/User";

type UserOption = { id: string; email: string; display: string };

interface Props {
  chatRoomId: string;
  initialParticipantIds?: string[];
  onUpdated?: (participantIds: string[], participantEmails?: string[]) => void;
}

export const ManageParticipants = ({
  chatRoomId,
  initialParticipantIds = [],
  onUpdated,
}: Props) => {
  const { theme } = useTheme();
  const { fetchChatRoomById, handleAddParticipants, handleRemoveParticipant } =
    useChatRoomStore();
  const { fetchUsersByName } = useUserStore();

  const [participantIds, setParticipantIds] = useState<string[]>(
    initialParticipantIds,
  );
  const [participantEmails, setParticipantEmails] = useState<string[]>([]);
  const [participantMap, setParticipantMap] = useState<
    Record<string, { email?: string; display?: string }>
  >({});
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!chatRoomId) return;
    const load = async () => {
      setLoadingRoom(true);
      try {
        const resp = await fetchChatRoomById(chatRoomId);
        if (resp?.data) {
          const ids: string[] = resp.data.participantIds ?? [];
          const emails: string[] = resp.data.participantEmails ?? [];
          setParticipantIds(ids);
          setParticipantEmails(emails);
          onUpdated?.(ids, emails);

          if (ids.length && emails.length && ids.length === emails.length) {
            const map: Record<string, { email?: string; display?: string }> =
              {};
            ids.forEach((id, idx) => {
              const email = emails[idx];
              map[id] = { email, display: email };
            });
            setParticipantMap((prev) => ({ ...prev, ...map }));
          } else {
            const map: Record<string, { email?: string; display?: string }> =
              {};
            ids.forEach((id, idx) => {
              map[id] = {
                email: emails[idx] ?? undefined,
                display: emails[idx] ?? id,
              };
            });
            setParticipantMap((prev) => ({ ...prev, ...map }));
          }
        }
      } catch (err: unknown) {
        const apiError = err as ApiError;
        ToastMessage({
          type: "error",
          title: apiError?.title ?? "Error",
          description: apiError?.description ?? "Failed to load participants.",
        });
      } finally {
        setLoadingRoom(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomId]);

  const handleSearch = async (q: string) => {
    setQuery(q);
    setResults([]);
    if (!q || q.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetchUsersByName({
        searchValue: q.trim(),
        page: 0,
        size: 50,
      });
      const options: UserOption[] = (res?.data?.content ?? []).map(
        (u: User) => ({
          id: u.id,
          email: u.email,
          display: u.name ? `${u.name} ${u.surname ?? ""}`.trim() : u.email,
        }),
      );
      const filtered = options.filter(
        (o) => !participantIds.includes(o.id) && !selectedIds.includes(o.id),
      );
      setResults(filtered);
    } catch (err) {
      console.error("Search users error", err);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const addId = (id: string, email?: string, display?: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id) || participantIds.includes(id)) return prev;
      return [...prev, id];
    });
    setParticipantMap((prev) => ({ ...prev, [id]: { email, display } }));
    setQuery("");
    setResults([]);
  };

  const removeSelected = (id: string) => {
    setSelectedIds((prev) => prev.filter((e) => e !== id));
  };

  const handleAddSelected = async () => {
    if (!chatRoomId) return;
    const unique = Array.from(
      new Set(selectedIds.map((id) => String(id).trim()).filter(Boolean)),
    );
    if (unique.length === 0) {
      ToastMessage({
        type: "error",
        title: "Validation",
        description: "Select at least one participant to add.",
      });
      return;
    }

    setSaving(true);
    try {
      await handleAddParticipants(chatRoomId, unique);

      ToastMessage({
        type: "success",
        title: "Participants added",
        description: `${unique.length} participant(s) added.`,
      });

      const resp = await fetchChatRoomById(chatRoomId);
      if (resp?.data) {
        setParticipantIds(resp.data.participantIds ?? []);
        setParticipantEmails(resp.data.participantEmails ?? []);
        const ids = resp.data.participantIds ?? [];
        const emails = resp.data.participantEmails ?? [];
        const map: Record<string, { email?: string; display?: string }> = {};
        ids.forEach((id: string, idx: number) => {
          const email = emails[idx] ?? undefined;
          map[id] = { email, display: email ?? id };
        });
        setParticipantMap((prev) => ({ ...prev, ...map }));
        onUpdated?.(
          resp.data.participantIds ?? [],
          resp.data.participantEmails ?? [],
        );
      } else {
        setParticipantIds((prev) => Array.from(new Set([...prev, ...unique])));
        onUpdated?.(
          Array.from(new Set([...participantIds, ...unique])),
          participantEmails,
        );
      }

      setSelectedIds([]);
      setQuery("");
      setResults([]);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      ToastMessage({
        type: "error",
        title: apiError?.title ?? "Add failed",
        description: apiError?.description ?? "Failed to add participants.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveParticipantAsync = async (id: string) => {
    if (!chatRoomId) return;
    const display =
      participantMap[id]?.display ?? participantMap[id]?.email ?? id;
    const confirmed = window.confirm(`Remove ${display} from this chat?`);
    if (!confirmed) return;

    setRemovingId(id);
    const previousIds = [...participantIds];
    const previousEmails = [...participantEmails];

    // optimistic update
    setParticipantIds((prev) => prev.filter((p) => p !== id));
    setParticipantEmails((prev) => {
      const emailToRemove = participantMap[id]?.email;
      return emailToRemove ? prev.filter((e) => e !== emailToRemove) : prev;
    });
    onUpdated?.(
      participantIds.filter((p) => p !== id),
      participantEmails,
    );

    try {
      await handleRemoveParticipant(chatRoomId, id);
      ToastMessage({
        type: "success",
        title: "Participant removed",
        description: `${display} removed from the chat.`,
      });

      const resp = await fetchChatRoomById(chatRoomId);
      if (resp?.data) {
        setParticipantIds(resp.data.participantIds ?? []);
        setParticipantEmails(resp.data.participantEmails ?? []);
        const ids = resp.data.participantIds ?? [];
        const emails = resp.data.participantEmails ?? [];
        const map: Record<string, { email?: string; display?: string }> = {};
        ids.forEach((pid: string, idx: number) => {
          const email = emails[idx] ?? undefined;
          map[pid] = { email, display: email ?? pid };
        });
        setParticipantMap((prev) => ({ ...prev, ...map }));
        onUpdated?.(
          resp.data.participantIds ?? [],
          resp.data.participantEmails ?? [],
        );
      }
    } catch (err: unknown) {
      // rollback
      setParticipantIds(previousIds);
      setParticipantEmails(previousEmails);
      onUpdated?.(previousIds, previousEmails);
      const apiError = err as ApiError;
      ToastMessage({
        type: "error",
        title: apiError?.title ?? "Remove failed",
        description: apiError?.description ?? "Failed to remove participant.",
      });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAddSelected();
      }}
    >
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium justify-center flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""}`}
        >
          <FilePen />
          Manage Participants
        </SheetTitle>
        <SheetDescription className="justify-center flex">
          Add or remove participants. Server is the source of truth.
        </SheetDescription>
      </SheetHeader>

      <Separator />

      <div className="grid flex-1 auto-rows-min gap-5 px-4 py-2">
        <div className="grid gap-2">
          <Label className="text-[13px]">Current Participants</Label>
          <div className="border rounded p-2 max-h-40 overflow-y-auto bg-background">
            {loadingRoom ? (
              <>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </>
            ) : participantIds.length > 0 ? (
              participantIds.map((id) => {
                const info = participantMap[id];
                const display = info?.display ?? info?.email ?? id;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-2 py-1"
                  >
                    <div className="text-sm">{display}</div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipantAsync(id)}
                        className="text-red-500 text-xs"
                        disabled={removingId !== null}
                        aria-label={`Remove ${display}`}
                      >
                        {removingId === id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-primary/70">
                No participants yet.
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-[13px]">Add Participants</Label>
          <Input
            placeholder="Search users by name or email (min 2 chars)"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search users"
          />

          {searching && (
            <div className="text-sm text-primary/60">Searching...</div>
          )}

          {results.length > 0 && (
            <div className="border rounded mt-2 max-h-48 overflow-y-auto bg-background">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="p-2 cursor-pointer text-xs hover:bg-primary/10 flex justify-between items-center"
                  onClick={() => addId(r.id, r.email, r.display)}
                >
                  <div>
                    <div className="font-medium">{r.display}</div>
                    <div className="text-[11px] text-primary/60">{r.email}</div>
                  </div>
                  <div className="text-[11px] text-primary/60">Add</div>
                </div>
              ))}
            </div>
          )}

          {selectedIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedIds.map((id) => {
                const info = participantMap[id];
                const display = info?.display ?? info?.email ?? id;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded text-xs"
                  >
                    <span>{display}</span>
                    <button
                      type="button"
                      onClick={() => removeSelected(id)}
                      className="text-red-500 ml-1"
                      aria-label={`Remove ${display}`}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <SheetFooter>
        <div className="w-full flex justify-between items-center gap-2">
          <div className="text-xs text-primary/60">
            Selected: {selectedIds.length}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleAddSelected}
              disabled={saving || selectedIds.length === 0}
              variant="ghost"
              className="font-medium border border-green-500 text-green-500"
            >
              {saving ? "Adding..." : "Add Selected"}
            </Button>

            <SheetClose asChild>
              <Button
                variant="ghost"
                className="cursor-pointer text-red-500 font-medium border border-red-500"
              >
                <XCircle />
                Cancel
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetFooter>
    </form>
  );
};
