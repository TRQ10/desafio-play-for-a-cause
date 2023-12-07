import { Injectable, NotFoundException } from '@nestjs/common';
import { Chat, Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) { }

    async createChat(user1Id: number, user2Id: number): Promise<Chat> {
        const [sortedUser1Id, sortedUser2Id] = [Math.min(user1Id, user2Id), Math.max(user1Id, user2Id)];
        const user1 = await this.prisma.user.findUnique({ where: { id: sortedUser1Id } });
        const user2 = await this.prisma.user.findUnique({ where: { id: sortedUser2Id } });

        if (!user1 || !user2) {
            throw new NotFoundException('Usuário não encontrado');
        }

        // Verifica se já existe um chat entre esses usuários
        const existingChat = await this.prisma.chat.findFirst({
            where: {
                OR: [
                    { user1Id: sortedUser1Id, user2Id: sortedUser2Id },
                    { user1Id: sortedUser2Id, user2Id: sortedUser1Id },
                ],
            },
        });

        if (existingChat) {
            throw new Error('Já existe um chat entre esses usuários');
        }

        // Cria um novo chat
        return this.prisma.chat.create({
            data: {
                user1Id: sortedUser1Id,
                user2Id: sortedUser2Id,
            },
        });
    }

    async getUserChats(userId: number): Promise<Chat[]> {
        const userChats = await this.prisma.chat.findMany({
            where: {
                OR: [
                    { user1Id: userId },
                    { user2Id: userId },
                ],
            },
        });

        if (!userChats || userChats.length === 0) {
            throw new NotFoundException(`Usuário com ID ${userId} não tem conversas.`);
        }

        return userChats;
    }

    async getChat(chatId: number): Promise<Chat | null> {
        return this.prisma.chat.findUnique({
            where: { id: chatId },
        });
    }

    async getChatMessages(chatId: number): Promise<Message[]> {
        return this.prisma.message.findMany({
            where: {
                chatId: Number(chatId), // Certifique-se de converter para número aqui
            },
            orderBy: {
                order: "asc",
            },
        });
    }

    async getInvertedChatMessages(chatId: number): Promise<Message[]> {
        const messages = await this.prisma.message.findMany({
            where: {
                chatId: Number(chatId),
            },
            orderBy: {
                order: 'asc',
            },
        });

        return messages.reverse();
    }


}
