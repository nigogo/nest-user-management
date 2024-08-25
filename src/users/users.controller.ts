import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from '../interfaces/user.interface';
import { GetUser } from '../decorators/get-user.decorator';
import { UserDto } from '../auth/dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	@ApiBearerAuth()
	// TODO i can get by id here, more robust
	async me(@GetUser() { username }: User): Promise<UserDto> {
		return this.usersService.getUserByUsername(username);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('me')
	@ApiBearerAuth()
	async updateMe(
		@GetUser() { id }: User,
		@Body() updateUserDto: UpdateUserDto
	): Promise<UserDto> {
		return this.usersService.updateUser(id, updateUserDto);
	}
}
