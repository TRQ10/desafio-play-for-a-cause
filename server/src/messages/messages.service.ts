import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from '@prisma/client';
import { UpdateMessageDtoType } from 'src/Dto/message-dto';
import { EventsGateway } from 'src/events/events.gateway';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private eventGateway: EventsGateway,
  ) { }

  async sendMessage(chatId: number, senderId: number, content: string): Promise<Message> {
    // Verifica se o chat existe
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });

    if (!chat) {
      throw new NotFoundException('Chat não encontrado');
    }

    // Verifica se o usuário que envia a mensagem pertence ao chat
    if (chat.user1Id !== senderId && chat.user2Id !== senderId) {
      throw new NotFoundException('Usuário não pertence a este chat');
    }

    // Cria a mensagem
    const newMessage = await this.prisma.message.create({
      data: {
        chatId,
        senderId,
        content,
      },
    });
    this.eventGateway.sendMessage(newMessage);
    return newMessage;
  }

  async deleteMessage(chatId: number, messageId: number): Promise<void> {
    // Verifica se a mensagem existe no chat especificado
    const message = await this.prisma.message.findUnique({
      where: {
        id: messageId,
        chatId: chatId,
      },
    });

    if (!message) {
      throw new NotFoundException('Mensagem não encontrada no chat especificado');
    }

    // Deleta a mensagem
    await this.prisma.message.delete({ where: { id: messageId } });
  }

  async updateMessage(updateMessageDto: UpdateMessageDtoType): Promise<Message> {
    const { chatId, messageId, newContent } = updateMessageDto;

    const message = await this.prisma.message.findUnique({
      where: {
        id: messageId,
        chatId: chatId,
      },
    });

    if (!message) {
      throw new NotFoundException('Mensagem não encontrada no chat especificado');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        content: newContent,
        updatedAt: new Date(),
        order: message.order,
      },
    });
  }
}
