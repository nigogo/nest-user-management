import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserDto } from '../auth/dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from '../interfaces/user.interface';

@Injectable()
export class UsersService {
	logger = new Logger(UsersService.name);

	constructor(private readonly prisma: PrismaService) {}

	async getUserForInternalUse(username: string): Promise<User | null> {
		try {
			const user = await this.prisma.user.findUnique({ where: { username } });
			if (user) {
				return {
					id: user.id,
					username: user.username,
					password: user.password,
				};
			}
			return null;
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2025') {
					throw new NotFoundException(
						`User with username ${username} not found`
					);
				}
			}
			this.logger.error(e);
			throw e;
		}
	}

	async getUserByUsername(username: string): Promise<UserDto> {
		try {
			const user = await this.prisma.user.findUnique({ where: { username } });
			return plainToInstance(UserDto, user);
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2025') {
					throw new NotFoundException(
						`User with username ${username} not found`
					);
				}
			}
			this.logger.error(e);
			throw e;
		}
	}
}
