import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async getUserByUsername(username: string): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { username } });
	}
}
