/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import * as jwt from 'jsonwebtoken';


@Injectable()
export class JwtGuard implements CanActivate {
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException();
        try {
            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decodedToken);
                    }
                })
            })
            request['user'] = decoded;
        }
        catch {
            throw new UnauthorizedException();
        }

        return true;

    }

    private extractTokenFromHeader(request: Request) {
        const authHeader = request.headers.authorization;
        if (authHeader) {
            const [type, token] = authHeader.split(' ') ?? [];
            if (type === 'Bearer') {
                return token;
            }
        }
        return undefined;
    }
}