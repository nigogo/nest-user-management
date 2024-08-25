import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsValidPassword } from '../../decorators/is-valid-password.decorator';
import {
	passwordMessage,
	passwordOptions,
} from '../../common/validation-options';

export class ChangePasswordDto {
	@ApiProperty()
	@IsString()
	oldPassword: string;

	@ApiProperty()
	@IsValidPassword(passwordOptions, { message: passwordMessage })
	newPassword: string;
}
