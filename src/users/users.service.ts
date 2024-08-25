import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserDto } from '../auth/dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from '../interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';

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

	async getUser(id: number): Promise<UserDto> {
		try {
			const user = await this.prisma.user.findUnique({ where: { id } });
			return plainToInstance(UserDto, user);
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2025') {
					throw new NotFoundException(`User not found`);
				}
			}
			this.logger.error(e);
			throw e;
		}
	}

	async updateUser(id: number, { username }: UpdateUserDto): Promise<UserDto> {
		try {
			const user = await this.prisma.user.update({
				where: { id },
				data: { username },
			});

			// note: if we need the username change to be reflected in the JWT token, we need to log the user out and back in

			return plainToInstance(UserDto, user);
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					const message = `User with username '${username}' already exists`;
					this.logger.error(message);
					throw new ConflictException(message);
				}
			}
			this.logger.error(e);
			throw e;
		}
	}
}
