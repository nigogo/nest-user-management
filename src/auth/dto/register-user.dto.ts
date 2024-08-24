import { IsValidUsername } from '../../decorators/is-valid-username.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidPassword } from '../../decorators/is-valid-password.decorator';

export class RegisterUserDto {
	@IsValidUsername(
		{
			minLength: 4,
			maxLength: 16,
			allowedCharacters: /^[a-zA-Z0-9_]+$/,
		},
		{
			message:
				'Username must be between 4 and 16 characters long and can only contain letters, numbers, and underscores',
		}
	)
	@ApiProperty({ required: true })
	username: string;

	@IsValidPassword(
		{
			minLength: 8,
			maxLength: 64,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		},
		{
			message:
				'Password must be between 8 and 64 characters long and contain at least one uppercase letter, one number, and one special character',
		}
	)
	@ApiProperty({ required: true })
	password: string;
}
