import { Module } from '@nestjs/common';
import { MessageService } from './messages.service';
import { MessageController } from './messages.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';


@Module({
  providers: [MessageService, PrismaService, EventsGateway],
  controllers: [MessageController],
})
export class MessagesModule { }
