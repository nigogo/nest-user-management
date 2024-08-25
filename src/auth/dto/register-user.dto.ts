import { IsValidUsername } from '../../decorators/is-valid-username.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidPassword } from '../../decorators/is-valid-password.decorator';
import {
	passwordMessage,
	passwordOptions,
	usernameMessage,
	usernameOptions,
} from '../../common/validation-options';

export class RegisterUserDto {
	@IsValidUsername(usernameOptions, { message: usernameMessage })
	@ApiProperty({ required: true })
	username: string;

	@IsValidPassword(passwordOptions, { message: passwordMessage })
	@ApiProperty({ required: true })
	password: string;
}
