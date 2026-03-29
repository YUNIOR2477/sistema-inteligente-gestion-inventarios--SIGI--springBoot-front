export interface NewChatMessage{
    roomId:string;
    content:string;
}

export interface ChatMessage{
    id:string;
    roomId:string;
    senderEmail:string;
    content:string;
    isRead:string;
    sentAt:string;
}

export interface sendMessage {
  content: string;
  roomId: string;
  senderId: string;
}