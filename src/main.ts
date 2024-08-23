import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();
	app.use(helmet());
	app.setGlobalPrefix('api/v1');
	app.useGlobalPipes(new ValidationPipe());

	// TODO Disable Swagger in production (it will negatively impact cold start times)
	const config = new DocumentBuilder()
		.setTitle('User Management')
		.setDescription(
			'A simple user management API that allows a user to register, login, view and update their profile.'
		)
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/v1', app, document);

	await app.listen(3000);
}
bootstrap();
