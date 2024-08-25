import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from '../interfaces/user.interface';
import { GetUser } from '../decorators/get-user.decorator';
import { UserDto } from '../auth/dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async me(@GetUser() { username }: User): Promise<UserDto> {
		console.log('username', username);
		return this.usersService.getUserByUsername(username);
	}
}
