export interface NewChatRoom{
    name:string;
    participantIds:string[];
}

export interface ChatRoom{
    id:string;
    name:string;
    active:string;
    participantEmails:string[];
    participantIds:string[];
    createdAt:string;
    updatedAt:string;
    unread:string
}