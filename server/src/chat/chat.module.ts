import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
    providers: [ChatService, PrismaService, EventsGateway],
    controllers: [ChatController],
})
export class ChatModule { }
