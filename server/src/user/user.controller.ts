/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, CreateUserDtoSchema } from '../Dto/create-user.dto'
import { UserService } from './user.service';
import { z } from 'zod';
import { JwtGuard } from 'src/auth/guards/jwt.guard';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /** Get Methods */
  @Get(':name')
  async findOne(@Param('name') name: string) {
    try {
      const user = await this.userService.getUser(name);
      return user;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get()
  async getUsers(@Query() params: { skip?: number; take?: number }) {
    try {
      const result = await this.userService.getAllUsers();
      return result;
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Put Methods */
  @UseGuards(JwtGuard)
  @Put('update/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    try {
      const validatedData = CreateUserDtoSchema.parse(updateUserDto);
      const result = await this.userService.updateUser(parseInt(id, 10), validatedData);
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new HttpException(error.errors, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Delete Methods */
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    try {
      const result = await this.userService.deleteUser(id);
      return result;
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  /** Post Methods */
  @UseGuards(JwtGuard)
  @Post('generate-otp')
  async generateOTP() {
    try {
      const generatedOTP = this.userService.generateOTP();
      return { code: generatedOTP };
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard)
  @Post('verify-otp')
  async verifyOTP(@Body() body: { name: string, code: string }) {
    try {
      const storedOTP = this.userService.getOTP();

      if (storedOTP && parseInt(storedOTP) === parseInt(body.code)) {
        this.userService.resetOTP();
        this.userService.setResetSession(true);
        return { msg: 'Verification successful!' };
      }

      throw new UnauthorizedException('Invalid OTP');
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard)
  @Post('create-reset-session')
  async createResetSession() {
    try {
      const result = await this.userService.createResetSession();
      return result;
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard)
  @Post('reset-password')
  async resetPassword(@Body() body: { name: string; senha: string }) {
    try {
      const result = await this.userService.resetPassword(body.name, body.senha);
      console.log(result)
      return result;
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
