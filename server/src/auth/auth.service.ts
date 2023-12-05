/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginDto } from '../Dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcryptjs';


const EXPIRE_TIME = 5 * 60 * 60 * 1000

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) { }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcryptjs.hash(password, saltRounds);
  }

  async register(body: CreateUserDto) {
    const { name, senha, picture = '', email } = body;

    try {
      // Verificar se o usuário já existe
      const existname = await this.prisma.user.findUnique({ where: { name } });
      if (existname) {
        console.error(`User with name "${name}" already exists.`);
        throw new ConflictException('Please choose a unique name');
      }

      // Verificar se o e-mail já existe
      const existEmail = await this.prisma.user.findUnique({ where: { email } });
      if (existEmail) {
        console.error(`User with email "${email}" already exists.`);
        throw new ConflictException('Please choose a unique email');
      }

      // Hash da senha
      const hashedPassword = await this.hashPassword(senha);

      // Criar novo usuário
      const newUser = await this.prisma.user.create({
        data: {
          name,
          senha: hashedPassword,
          picture: body.picture,
          email,
        },
      });

      return { msg: 'User registered successfully' };
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }


  async login(body: any) {
    const { name, senha } = body;

    const validatedUser = await this.validateUser(body);

    if (validatedUser) {
      try {
        const user = await this.prisma.user.findUnique({ where: { name } });
        if (!user) {
          throw new NotFoundException('User not found');
        }

        // Create JWT token
        const token = jwt.sign({ userId: user.id, name: user.name }, process.env.JWT_SECRET, {
          expiresIn: '5h',
        });

        const refreshToken = jwt.sign({ userId: user.id, name: user.name }, process.env.JWT_REFRESH_SECRET, {
          expiresIn: '7d',
        });

        return {
          user,
          backendTokens: {
            token,
            refreshToken,
            expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME)
          }
        };

      } catch (error) {
        throw error;
      }
    }
  }


  async validateUser(body: LoginDto) {

    const user = await this.userService.getUser(body.name)

    if (user && (await compare(body.senha, user?.senha))) {
      const { senha, ...result } = user;
      return result;
    }
    throw new UnauthorizedException("name ou senha incorretos");
  }

  async refreshToken(user: any) {

    const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '5h',
    });

    const refreshToken = jwt.sign({ name: user.name }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    return {
      token,
      refreshToken,
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME)
    }

  }

}
