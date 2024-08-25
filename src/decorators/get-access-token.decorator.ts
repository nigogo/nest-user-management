import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAccessToken = createParamDecorator(
	(_: unknown, ctx: ExecutionContext): string => {
		const request = ctx.switchToHttp().getRequest();
		const authorizationHeader = request.headers.authorization;

		if (!authorizationHeader) {
			throw new Error('No authorization header provided');
		}

		const token = authorizationHeader.split(' ')[1];

		if (!token) {
			throw new Error('Invalid authorization header format');
		}

		return token;
	}
);
