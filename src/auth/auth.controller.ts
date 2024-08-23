import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor() {}

	@Post('register')
	async register(@Body() registerUserDto: RegisterUserDto) {
		return JSON.stringify(registerUserDto);
	}
}
