import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthMiddleware, LocalVariablesMiddleware,  VerifyUserMiddleware } from 'src/auth/auth.middleware';


@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('user/update/:id');
    consumer.apply(VerifyUserMiddleware,LocalVariablesMiddleware).forRoutes('user/generate-otp', 'user/verify-otp');
  }
}