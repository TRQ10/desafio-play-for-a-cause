/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { CreateUserDto, UserDto } from 'src/Dto/create-user.dto';
import { WsJwtGuard } from 'src/auth/ws-jwt/ws-jwt.guard';
import { SocketAuthMiddleware } from 'src/auth/ws-jwt/ws.nw';
import { ServerToClientEvents, message } from 'src/types/events';

@WebSocketGateway({
  namespace: 'events',
  cors: {
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }
})
export class EventsGateway {
  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
    console.log('afterInit')
  }



  @UseGuards(WsJwtGuard)
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  handleFriendRequest(payload: any): string {
    this.server.emit('newFriendRequest', payload);
    return 'Friend request sent!';
  }

  acceptFriendRequest(payload: any): string {
    this.server.emit('acceptFriendRequest', payload);
    return 'Frend request accepted!';
  }

  rejectFriendRequest(payload: any): string {
    this.server.emit('rejecttFriendRequest', payload);
    return 'Frend request rejected!';
  }

  sendUpdatedFriendsList(friends: UserDto[]): void {
    this.server.emit(`UpdatedFriendsList`, friends);
  }

  friendPendingRequest(payload: { userId: number, pendingFriends: CreateUserDto[] }): void {
    this.server.emit('UpdatedPendingRequests', payload);
  }

  sendMessage(message: message) {
    this.server.emit('newMessage', message)
    return 'Message sent!';
  }

  handleDeleteMessage(payload: { messageId: number; chatId: number }): void {
    this.server.emit('messageDeleted', payload);
  }

  handleUpdateMessage(updatedMessage: message): void {
    this.server.emit('messageUpdated', updatedMessage);
  }

  sendChatHistory(messages: message[]): void {
    this.server.emit('chatHistory', messages);
  }

  sendInvertedChatHistory(messages: message[]): void {
    this.server.emit('reversedChatHistory', messages)
  }

}

