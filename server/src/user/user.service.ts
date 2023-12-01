// user.service.ts
import { Injectable, NotFoundException, ConflictException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginDto } from '../Dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as otpGenerator from 'otp-generator';


@Injectable()
export class UserService {

  private OTP: string | null = null;
  private resetSession: boolean = false;

  generateOTP(): string {
    this.OTP = otpGenerator.generate(7, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    return this.OTP;
  }

  getOTP(): string | null {
    return this.OTP;
  }

  resetOTP(): void {
    this.OTP = null;
  }

  setResetSession(value: boolean): void {
    this.resetSession = value;
  }

  constructor(private readonly prisma: PrismaService) { }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcryptjs.hash(password, saltRounds);
  }


  async getUser(usuario: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { usuario } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      // Omitting the password before sending the user data
      const { senha, ...userData } = user;
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async register(body: CreateUserDto) {
    const { usuario, senha, perfil = '', email } = body;

    try {
      const existUsuario = await this.prisma.user.findUnique({ where: { usuario } });
      if (existUsuario) {
        throw new ConflictException('Please choose a unique usuario');
      }

      const existEmail = await this.prisma.user.findUnique({ where: { email } });
      if (existEmail) {
        throw new ConflictException('Please choose a unique email');
      }

      const hashedPassword = await this.hashPassword(senha);

      const newUser = await this.prisma.user.create({
        data: {
          usuario,
          senha: hashedPassword,
          perfil: body.perfil, // 'body.perfil' contém a string base64 da imagem
          email,
        },
      });

      return { msg: 'User registered successfully' };
    } catch (error) {
      console.error('Error during registration:', error); // Add this line for enhanced logging
      throw error;
    }
  }

  async login(body: LoginDto) {
    const { usuario, senha } = body;

    try {
      const user = await this.prisma.user.findUnique({ where: { usuario } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Compare passwords
      const passwordCheck = await bcryptjs.compare(senha, user.senha);
      if (!passwordCheck) {
        throw new UnauthorizedException('Invalid password');
      }

      // Create JWT token
      const token = jwt.sign({ userId: user.id, usuario: user.usuario }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });

      return {
        msg: 'Login Successful',
        usuario: user.usuario,
        token,
      };
    } catch (error) {
      throw error;
    }
  }


  async updateUser(userId: number, body: CreateUserDto) {
    try {
      const { usuario, senha, perfil, email } = body;

      const updatedData = await this.prisma.user.update({
        where: { id: userId },
        data: {
          usuario: usuario,
          senha: await this.hashPassword(senha),
          perfil: perfil || '',
          email,
        },
      });

      if (!updatedData) {
        throw new UnauthorizedException('User not found');
      }

      return { msg: 'Information updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const allUsers = await this.prisma.user.findMany();
      return { success: true, data: allUsers };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(usuario: string) {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { usuario },
      });
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      return { msg: 'User deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async verifyOTP(usuario: string, code: string) {
    if (parseInt(this.OTP) === parseInt(code)) {
      this.resetSession = true;
      return { msg: 'Verification successful!' };
    }
    throw new UnauthorizedException('Invalid OTP');
  }

  async createResetSession() {
    if (this.resetSession) {
      return { flag: this.resetSession };
    }
    throw new UnauthorizedException('Session expired');
  }

  async resetPassword(usuario: string, senha: string) {
    try {
      if (!this.resetSession) {
        throw new UnauthorizedException('Session expired');
      }

      const user = await this.prisma.user.findUnique({ where: { usuario } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await this.hashPassword(senha);

      console.log('Hashed Password:', hashedPassword);
      console.log('Usuario:', usuario);

      const updateResult = await this.prisma.user.update({
        where: { usuario: user.usuario },
        data: { senha: hashedPassword },
      });

      console.log('Update Result:', updateResult);

      if (!updateResult) {
        throw new Error('Failed to update user password');
      }

      this.resetSession = false;
      return { msg: 'Password reset successful' };
    } catch (error) {
      console.error('Password reset error:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

