import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// note: intentionally not exposing id or date fields because they are not needed (we get the id from the token)
@Exclude()
export class UserDto {
	@Expose()
	@ApiProperty()
	username: string;
}
