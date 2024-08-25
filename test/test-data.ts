/*
This file contains test data that can be used in multiple test files.
Having it this way makes it easier to maintain the test data in one place.
However it is bad for locality, as the test data is not close to the test files.
I made this trade-off because it is closer to a real-world scenario where the test data is often seeded to a database.
 */

import { RegisterUserDto } from '../src/auth/dto/register-user.dto';
import { UserDto } from '../src/auth/dto/user.dto';
import { User } from '../src/interfaces/user.interface';

export const registerUserDto: RegisterUserDto = {
	username: 'john_doe',
	password: 'P4$$w0rd',
};

export const user: User = {
	id: 1,
	username: registerUserDto.username,
	password: 'password-hash',
};

export const userDto: UserDto = {
	username: registerUserDto.username,
};
