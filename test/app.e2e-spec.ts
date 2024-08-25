import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { registerUserDto } from './test-data';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Application Behavior Tests (e2e)', () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			providers: [PrismaService],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();
		prisma = moduleFixture.get<PrismaService>(PrismaService);
	});

	afterEach(async () => {
		await prisma.user.deleteMany();
	});

	it('/auth/register (POST) - should create a new user', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send(registerUserDto)
			.expect((res) => {
				expect(res.status).toBe(201);
				expect(res.body).toBeDefined();
				expect(res.body).toHaveProperty('id');
				expect(res.body).toHaveProperty('username', registerUserDto.username);
				expect(res.body).toHaveProperty('createdAt');
				expect(res.body).toHaveProperty('updatedAt');
			});
	});

	it('/auth/register (POST) - should fail if username already exists', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send(registerUserDto)
			.expect(201);

		await request(app.getHttpServer())
			.post('/auth/register')
			.send(registerUserDto)
			.expect(409);
	});

	it('/auth/register (POST) - should fail if the data is invalid', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send({ username: 'foo', password: 'bar' })
			.expect((res) => {
				expect(res.status).toBe(400);
				expect(res.body.message).toHaveLength(2);
			});

		await request(app.getHttpServer())
			.post('/auth/register')
			.send({
				username:
					'***this_username_is_too_long_and_has_symbols_other_than_underscore',
				password:
					'this-is-a-very-long-password-that-should-fail-validation-because-it-is-over-64-characters',
			})
			.expect((res) => {
				expect(res.status).toBe(400);
				expect(res.body.message).toHaveLength(2);
			});
	});

	it('/auth/login (POST) - should return an access token', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send(registerUserDto)
			.expect(201);

		await request(app.getHttpServer())
			.post('/auth/login')
			.send(registerUserDto)
			.expect((res) => {
				expect(res.status).toBe(201);
				expect(res.body).toHaveProperty('access_token');
			});
	});
});
