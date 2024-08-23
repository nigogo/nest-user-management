import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UserDto } from './dto/user.dto';

describe('AuthService', () => {
	const registerUserDto: RegisterUserDto = {
		username: 'john_doe',
		password: 'P4$$w0rd',
	};

	const userDto: UserDto = {
		id: 1,
		username: registerUserDto.username,
		createdAt: new Date('2023-08-23T00:00:00Z'),
		updatedAt: new Date('2023-08-23T00:00:00Z'),
	};

	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService, PrismaService],
		})
			.overrideProvider(PrismaService)
			.useValue({
				user: mockDeep<PrismaClient['user']>({
					create: jest.fn().mockResolvedValue(userDto),
				}),
			})
			.compile();

		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should hash the password', async () => {
		const spy = jest.spyOn(service, 'hashPassword');
		await service.register(registerUserDto);
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith(registerUserDto.password);
	});
});
