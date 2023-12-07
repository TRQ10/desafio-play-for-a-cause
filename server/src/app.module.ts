import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';;
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { MessagesModule } from './messages/messages.module';
import { FriendsController } from './friends/friends.controller';
import { FriendsService } from './friends/friends.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import { EventsModule } from './events/events.module';
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, MessagesModule, AuthModule, ChatModule, EventsModule],
  controllers: [AppController, FriendsController, ChatController],
  providers: [AppService, PrismaService, UserService, AuthService, FriendsService, ChatService, EventsGateway],

})
export class AppModule { }
