import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(
        @Body() body: { username: string; email: string; password: string },
    ) {
        return this.authService.register(body);
    }
    @Post('login')
    login(@Body() body: any) {
        return this.authService.login(body);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@Body() body: any) {
        return { message: 'You are logged in!' };
    }
}