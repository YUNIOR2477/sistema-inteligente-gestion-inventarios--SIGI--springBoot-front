import { ChatTable } from "@/components/shared/chat/ChatTable";
import { CardContent } from "@/components/ui/card";
import { FolderSearch } from "lucide-react";
import { useEffect } from "react";

export const SearchChatRoomPage = () => {
    useEffect(() => {
        localStorage.setItem("navigationBar", "Search ChatRooms")
        localStorage.setItem("navigationTitle", "ChatRooms")
    }, [])

    return (
 <div className="py-8">
            <CardContent>
                <h2 className="text-2xl sm:text-3xl font-medium text-primary mb-4 flex items-center gap-2 justify-center">
                    <FolderSearch size={40}/> Search ChatRooms
                </h2>
                <ChatTable/>
            </CardContent>
        </div>
    );
};
