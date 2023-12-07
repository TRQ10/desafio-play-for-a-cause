import { Controller, Post, Delete, Patch, Param, Body, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { MessageService } from './messages.service';
import { Message } from '@prisma/client';
import { SendMessageDto, SendMessageDtoType, UpdateMessageDtoType } from '../Dto/message-dto';
import { EventsGateway } from 'src/events/events.gateway';

@Controller('message')
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly eventsGateway: EventsGateway
    ) { }

    @Post('send-message')
    async sendMessage(@Body() messageDto: SendMessageDtoType): Promise<Message> {
        try {
            const validatedData = SendMessageDto.parse(messageDto)

            return await this.messageService.sendMessage(
                validatedData.chatId,
                validatedData.senderId,
                validatedData.content,
            );
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new Error('Erro ao enviar mensagem');
        }
    }

    @Delete('delete-message/:chatId/:messageId')
    async deleteMessage(
        @Param('chatId') chatId: number,
        @Param('messageId') messageId: number,
    ): Promise<void> {
        try {
            await this.messageService.deleteMessage(chatId, messageId);

            this.eventsGateway.handleDeleteMessage({ chatId, messageId });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new Error('Erro ao excluir mensagem');
        }
    }

    @Patch('update-message')
    async updateMessage(@Body() updateMessageDto: UpdateMessageDtoType): Promise<Message> {
        try {
            const updatedMessage = await this.messageService.updateMessage(updateMessageDto);

            this.eventsGateway.handleUpdateMessage(updatedMessage);

            return updatedMessage;
        } catch (error) {
            console.error('Erro ao atualizar mensagem:', error);
            throw new InternalServerErrorException('Erro ao atualizar mensagem');
        }
    }
}
