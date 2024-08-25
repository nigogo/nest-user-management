import { ApiProperty } from '@nestjs/swagger';
import { IsValidUsername } from '../../decorators/is-valid-username.decorator';
import {
	usernameMessage,
	usernameOptions,
} from '../../common/validation-options';

export class UpdateUserDto {
	@ApiProperty()
	@IsValidUsername(usernameOptions, { message: usernameMessage })
	username: string;
}
