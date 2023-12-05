import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
    controllers: [AuthController],
    providers: [UserService, AuthService, PrismaService],
})
export class AuthModule { }
