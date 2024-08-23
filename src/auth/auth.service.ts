import { Injectable, Logger } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(private readonly prisma: PrismaService) {}

	async register({ username, password }: RegisterUserDto): Promise<UserDto> {
		try {
			const user = await this.prisma.user.create({
				data: {
					username,
					password,
				},
			});

			this.logger.log(`User ${user.username} created`);

			return user;
		} catch (e) {
			this.logger.error(e.message);
			throw e;
		}
	}
}
