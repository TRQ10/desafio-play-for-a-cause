import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {

  messages: Message[] = [{ name: "Tiago", "message": "Helloooo" }]
  clientToUser = {};

  identify(nome: string, clientId: string) {
    this.clientToUser[clientId] = nome;

    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  create(createMessageDto: CreateMessageDto) {
    const message = {...createMessageDto}
    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages;
  }
}
