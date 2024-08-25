import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from '../interfaces/user.interface';
import { AccessTokenDto } from './dto/access-token.dto';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() registerUserDto: RegisterUserDto): Promise<UserDto> {
		return this.authService.register(registerUserDto);
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	@ApiBody({ type: LoginUserDto, required: true })
	login(@Req() req: Request & { user: User }): Promise<AccessTokenDto> {
		return this.authService.login(req.user);
	}
}
