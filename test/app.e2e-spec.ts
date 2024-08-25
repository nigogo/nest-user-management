import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { registerUserDto } from './test-data';
import { PrismaService } from '../src/prisma/prisma.service';
import { RegisterUserDto } from '../src/auth/dto/register-user.dto';

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
				expect(res.body).not.toHaveProperty('id');
				expect(res.body).toHaveProperty('username', registerUserDto.username);
				expect(res.body).not.toHaveProperty('createdAt');
				expect(res.body).not.toHaveProperty('updatedAt');
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
				expect(res.status).toBe(200);
				expect(res.body).toHaveProperty('access_token');
			});
	});

	it('/auth/login (POST) - should fail if the user does not exist', async () => {
		await request(app.getHttpServer())
			.post('/auth/login')
			.send(registerUserDto)
			.expect(401);
	});

	it('/auth/login (POST) - should fail if the username is incorrect', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send(registerUserDto)
			.expect(201);

		await request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...registerUserDto, username: 'wrong_username' })
			.expect(401);
	});

	it('/auth/login (POST) - should fail if the password is incorrect', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send(registerUserDto)
			.expect(201);

		await request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...registerUserDto, password: 'wrong_password' })
			.expect(401);
	});

	it('/users/me (GET) - should return the user profile', async () => {
		const accessToken = await registerUserAndLogin();

		await request(app.getHttpServer())
			.get('/users/me')
			.set('Authorization', `Bearer ${accessToken}`)
			.expect((res) => {
				expect(res.status).toBe(200);
				expect(res.body).toBeDefined();
				expect(res.body).not.toHaveProperty('id');
				expect(res.body).toHaveProperty('username', registerUserDto.username);
				expect(res.body).not.toHaveProperty('password');
				expect(res.body).not.toHaveProperty('createdAt');
				expect(res.body).not.toHaveProperty('updatedAt');
			});
	});

	it('/users/me (GET) - should fail if the access token is missing', async () => {
		await request(app.getHttpServer()).get('/users/me').expect(401);
	});

	it('/users/me (GET) - should fail if the access token is invalid', async () => {
		await request(app.getHttpServer())
			.get('/users/me')
			.set('Authorization', 'Bearer invalid_token')
			.expect(401);
	});

	it('/users/me (GET) - should fail if the access token is expired', async () => {
		const accessToken = await registerUserAndLogin();

		await new Promise((resolve) => setTimeout(resolve, 3000));

		await request(app.getHttpServer())
			.get('/users/me')
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(401);
	});

	it('/auth/logout (POST) - should revoke the access token', async () => {
		const accessToken = await registerUserAndLogin();

		await request(app.getHttpServer())
			.get('/auth/logout')
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(204);

		await request(app.getHttpServer())
			.get('/users/me')
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(401);
	});

	it('/auth/logout (POST) - should revoke the current access token only', async () => {
		const previousAccessToken = await registerUserAndLogin();
		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(registerUserDto)
			.expect(200);
		const currentAccessToken = body.access_token;

		await request(app.getHttpServer())
			.get('/auth/logout')
			.set('Authorization', `Bearer ${currentAccessToken}`)
			.expect(204);

		await request(app.getHttpServer())
			.get('/users/me')
			.set('Authorization', `Bearer ${previousAccessToken}`)
			.expect(200);
	});

	it('/users/me (PATCH) - should update the user profile', async () => {
		const accessToken = await registerUserAndLogin();
		const updatedUsername = 'new_username';

		await request(app.getHttpServer())
			.patch('/users/me')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({ username: updatedUsername })
			.expect((res) => {
				expect(res.status).toBe(200);
				expect(res.body).toBeDefined();
				expect(res.body).not.toHaveProperty('id');
				expect(res.body).toHaveProperty('username', updatedUsername);
				expect(res.body).not.toHaveProperty('password');
				expect(res.body).not.toHaveProperty('createdAt');
				expect(res.body).not.toHaveProperty('updatedAt');
			});
	});

	it('/users/me (PATCH) - should fail if the username already exists', async () => {
		const accessToken = await registerUserAndLogin();
		const updatedUsername = 'new_username';

		await request(app.getHttpServer())
			.post('/auth/register')
			.send({ ...registerUserDto, username: updatedUsername })
			.expect(201);

		await request(app.getHttpServer())
			.patch('/users/me')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({ username: 'new_username' })
			.expect(409);
	});

	it('/users/me (PATCH) - should return 200 if no data is changed', async () => {
		const accessToken = await registerUserAndLogin();

		await request(app.getHttpServer())
			.patch('/users/me')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({ username: registerUserDto.username })
			.expect(200);
	});

	it('/auth/change-password (POST) - should change the user password', async () => {
		const accessToken = await registerUserAndLogin();
		const newPassword = 'NewPassword123!';

		await request(app.getHttpServer())
			.post('/auth/change-password')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({ oldPassword: registerUserDto.password, newPassword })
			.expect(204);

		await request(app.getHttpServer())
			.get('/users/me')
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(401);

		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...registerUserDto, password: newPassword })
			.expect(200);

		await request(app.getHttpServer())
			.get('/users/me')
			.set('Authorization', `Bearer ${body.access_token}`)
			.expect(200);
	});

	// register user and login helper function, uses the default test data if no DTO is provided
	const registerUserAndLogin = async (
		dto: RegisterUserDto = registerUserDto
	): Promise<string> => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send(dto)
			.expect(201);

		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(dto)
			.expect(200);

		return body.access_token;
	};
});
