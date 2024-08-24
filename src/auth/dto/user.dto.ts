import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserDto {
	@Expose()
	@ApiProperty()
	id: number;

	@Expose()
	@ApiProperty()
	username: string;

	@Expose()
	@ApiProperty()
	createdAt: Date;

	@Expose()
	@ApiProperty()
	updatedAt: Date;
}
