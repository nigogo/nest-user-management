import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(private readonly prisma: PrismaService) {}

	async register({ username, password }: RegisterUserDto): Promise<UserDto> {
		try {
			const user = await this.prisma.user.create({
				data: {
					username,
					password: this.hashPassword(password),
				},
			});

			this.logger.log(`User ${user.username} created`);

			return user;
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					const message = `User with username ${username} already exists`;
					throw new ConflictException(message);
				}
			}

			this.logger.error(e.message);
			throw e;
		}
	}

	// public modifier for testing purposes, generally this is not recommended
	public hashPassword(password: string) {
		return bcrypt.hashSync(password, 10);
	}
}
