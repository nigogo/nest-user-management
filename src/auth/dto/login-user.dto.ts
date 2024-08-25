import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// note: username and password validators are not used here on purpose
export class LoginUserDto {
	@IsString()
	@ApiProperty()
	username: string;

	@IsString()
	@ApiProperty()
	password: string;
}
