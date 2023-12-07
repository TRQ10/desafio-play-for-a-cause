/* eslint-disable @typescript-eslint/no-unused-vars */
// user.service.ts
import { Injectable, NotFoundException, ConflictException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../Dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
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

  async updateUser(userId: number, body: CreateUserDto) {
    try {
      const { name, senha, picture, email } = body;

      const updatedData = await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: name,
          senha: await this.hashPassword(senha),
          picture: picture || '',
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

  async getUser(name: string) {
    try {

      const user = await this.prisma.user.findUnique({ where: { name: name } });
      if (!name) {
        throw new NotFoundException('User not found');
      }
      // Omitting the password before sending the user data
      const { ...userData } = user;
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: id } });

      // Correção: Verificar se o usuário não existe
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Omitindo a senha antes de enviar os dados do usuário
      const { senha, ...userData } = user;
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId: number) {
    try {

      const id = parseInt(userId.toString());

      const deletedUser = await this.prisma.user.delete({
        where: { id },
      });
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      return { msg: 'User deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async verifyOTP(name: string, code: string) {
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

  async resetPassword(name: string, senha: string) {
    try {
      if (!this.resetSession) {
        throw new UnauthorizedException('Session expired');
      }

      const user = await this.prisma.user.findUnique({ where: { name } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await this.hashPassword(senha);


      const updateResult = await this.prisma.user.update({
        where: { name: user.name },
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