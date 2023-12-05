import { Body, Controller, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto, CreateUserDtoSchema, LoginDto } from 'src/Dto/create-user.dto';
import { AuthService } from './auth.service';
import { z } from 'zod';
import { RefreshJwtGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            const validatedData = CreateUserDtoSchema.parse(createUserDto);
            const result = await this.authService.register(validatedData);
            return result;
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new HttpException('Usuário ou Email já existe', HttpStatus.CONFLICT);
            }
        }
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refreshToken(@Request() req) {
        return await this.authService.refreshToken(req.user)
    }

}
