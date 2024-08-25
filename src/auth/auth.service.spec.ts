import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { registerUserDto, user, userDto } from '../../test/test-data';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				UsersModule,
				JwtModule.register({
					secret: 'secret',
					signOptions: { expiresIn: '2m' },
				}),
			],
			providers: [AuthService, PrismaService],
		})
			.overrideProvider(PrismaService)
			.useValue({
				user: mockDeep<PrismaClient['user']>({
					create: jest.fn().mockResolvedValue(userDto),
					findUnique: jest.fn().mockResolvedValue(user),
				}),
			})
			.compile();

		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should hash the password when creating a new user', async () => {
		const spy = jest.spyOn(service, 'hashPassword');
		await service.register(registerUserDto);
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith(registerUserDto.password);
	});

	it('should compare the password to the hash when validating a user', async () => {
		const spy = jest.spyOn(service, 'comparePasswords');
		await service.register(registerUserDto);
		const { username, password } = registerUserDto;
		await service.validateUser({ username, password });
		expect(spy).toHaveBeenCalledTimes(1);
	});
});
