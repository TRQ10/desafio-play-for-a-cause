// auth.middleware.ts
import { Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req['user'] = decodedToken;
      next();
    } catch (error) {
      throw new UnauthorizedException('Authentication Failed!');
    }
  }
}

@Injectable()
export class LocalVariablesMiddleware implements NestMiddleware {A
  use(req: Request, res: Response, next: NextFunction) {
    req.app.locals = {
      OTP: null,
      resetSession: false,
    };
    next();
  }
}

@Injectable()
export class VerifyUserMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { usuario } = req.method === 'GET' ? req.query : req.body;

      // Check the user existence using Prisma
      const user = await this.prisma.user.findUnique({ where: { usuario } });

      if (!user) {
        throw new NotFoundException('Não foi possível encontrar o usuário!');
      }

      req['customUser'] = user; // Correção: Usando 'customUser' em vez de 'user'
      next();
    } catch (error) {
      return res.status(404).send({ error: 'Erro de autenticação' });
    }
  }
}


