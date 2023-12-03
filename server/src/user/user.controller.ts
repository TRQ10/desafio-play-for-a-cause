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
} from '@nestjs/common';
import { CreateUserDto, CreateUserDtoSchema, LoginDtoSchema, LoginDto } from '../Dto/create-user.dto'
import { UserService } from './user.service';
import { z } from 'zod';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**Get Methods */
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const user = await this.userService.getUser(id);
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


  /**Delete Methods */
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

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const validatedData = CreateUserDtoSchema.parse(createUserDto);
      const result = await this.userService.register(validatedData);
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new HttpException('Usuário ou Email já existe', HttpStatus.CONFLICT);
      }
    }
  }


  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const validatedData = LoginDtoSchema.parse(loginDto);
      const result = await this.userService.login(validatedData);
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new HttpException(error.errors, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('generate-otp')
  async generateOTP() {
    try {
      const generatedOTP = this.userService.generateOTP();
      return { code: generatedOTP };
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('verify-otp')
  async verifyOTP(@Body() body: { usuario: string, code: string }) {
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

  @Post('create-reset-session')
  async createResetSession() {
    try {
      const result = await this.userService.createResetSession();
      return result;
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { usuario: string; senha: string }) {
    try {
      const result = await this.userService.resetPassword(body.usuario, body.senha);
      console.log(result)
      return result;
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
