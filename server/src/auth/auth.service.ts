import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  generateToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
  }
}
