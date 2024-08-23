import { IsStrongPassword } from 'class-validator';
import { IsUsername } from '../../decorators/is-username.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
	@IsUsername(
		{
			minLength: 4,
			maxLength: 15,
			allowedCharacters: /^[a-zA-Z0-9_]+$/,
		},
		{
			message:
				'Username must be between 4 and 15 characters long and can only contain letters, numbers, and underscores',
		}
	)
	@ApiProperty({ required: true })
	username: string;

	@IsStrongPassword(
		{
			minLength: 8,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		},
		{
			message:
				'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character',
		}
	)
	@ApiProperty({ required: true })
	password: string;
}
