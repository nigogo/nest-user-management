import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../interfaces/user.interface';
import { AccessTokenDto } from './dto/access-token.dto';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { GetAccessToken } from '../decorators/get-access-token.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// note: not returning a token right away, because usually you would want to send a confirmation email first
	// TODO redirect anyway?
	@Post('register')
	async register(@Body() registerUserDto: RegisterUserDto): Promise<UserDto> {
		return this.authService.register(registerUserDto);
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	@HttpCode(200)
	@ApiBody({ type: LoginUserDto, required: true })
	login(@Req() req: Request & { user: User }): Promise<AccessTokenDto> {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('logout')
	@HttpCode(200)
	logout(@GetAccessToken() token: string): Promise<void> {
		return this.authService.logout(token);
	}
}
