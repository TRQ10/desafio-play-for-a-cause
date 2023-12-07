// chat.controller.ts

import { Controller, Post, Get, Param, Body, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat, Message } from '@prisma/client';
import { CreateChatDto } from '../Dto/chat-dto'
import { EventsGateway } from 'src/events/events.gateway';


@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly eventsGateway: EventsGateway
    ) { }

    @Post('create-chat')
    async createChat(@Body() createChatDto: CreateChatDto): Promise<Chat> {
        try {
            const validatedData = CreateChatDto.parse(createChatDto);

            return await this.chatService.createChat(
                validatedData.user1Id,
                validatedData.user2Id,
            );
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new Error('Erro ao criar chat');
        }
    }

    @Get('get-chat/:chatId')
    async getChat(@Param('chatId') chatId: string): Promise<Chat | null> {
        return this.chatService.getChat(parseInt(chatId));
    }



    @Get('get-chat-messages/:chatId')
    async getChatMessages(
        @Param('chatId') chatId: number,
    ): Promise<Message[]> {
        const messages = await this.chatService.getChatMessages(chatId);

        this.eventsGateway.sendChatHistory(messages);

        return messages;
    }

    @Get('get-inverted-chat-messages/:chatId')
    async getInvertedChatMessages(
        @Param('chatId') chatId: number,
    ): Promise<Message[]> {
        const invertedMessages = await this.chatService.getInvertedChatMessages(chatId);

        this.eventsGateway.sendInvertedChatHistory(invertedMessages);

        return invertedMessages;
    }

    @Get('get-user-chats/:userId')
    async getUserChats(@Param('userId') userId: string): Promise<Chat[]> {
        return this.chatService.getUserChats(parseInt(userId));
    }
}
