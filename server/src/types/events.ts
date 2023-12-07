import { UserDto } from "src/Dto/create-user.dto";

export interface message {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    isSeen: boolean;
    order: number;
}

export interface friendShip {
    id: number;
    user1Id: number;
    user2Id: number;
    status: string;
}


export interface ServerToClientEvents {
    newMessage: (payload: message) => void;
    newFriendRequest: (payload: friendShip) => void;
    messageDeleted: (payload: any) => void;
    messageUpdated: (payload: message) => void;
    chatHistory: (payload: message[]) => void;
    UpdatedFriendsList: (payload: UserDto[]) => void;
    acceptFriendRequest: (payload: any) => void;
    rejecttFriendRequest: (payload: any) => void;
    UpdatedPendingRequests: (payload: any) => void;
    reversedChatHistory: (payload: any) => void;
}