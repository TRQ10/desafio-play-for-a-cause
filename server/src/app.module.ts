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

@Module({
  imports: [UserModule, MessagesModule],
  controllers: [AppController, FriendsController],
  providers: [AppService, PrismaService, UserService, AuthService, FriendsService],
})
export class AppModule {}
