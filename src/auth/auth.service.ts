import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(private readonly prisma: PrismaService) {}

	async register({ username, password }: RegisterUserDto): Promise<UserDto> {
		try {
			const user = await this.prisma.user.create({
				data: {
					username,
					password: await this.hashPassword(password),
				},
			});

			// plainToInstance is used as a safeguard to ensure that no sensitive data is returned
			return plainToInstance(UserDto, user);
		} catch (e) {
			if (e.code === 'P2002') {
				const message = `User with username '${username}' already exists`;
				this.logger.error(message);
				throw new ConflictException(message);
			}

			this.logger.error(e);
			throw e;
		}
	}

	// public modifier for testing purposes, generally this is not recommended
	public async hashPassword(password: string) {
		return bcrypt.hash(password, 10);
	}
}
