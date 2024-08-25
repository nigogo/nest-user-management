import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AccessTokenDto {
	@ApiProperty()
	@Expose()
	access_token: string;
}
