import {
	registerDecorator,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
	ValidationOptions,
} from 'class-validator';

export type IsValidUsernameOptions = {
	minLength?: number;
	maxLength?: number;
	allowedCharacters?: RegExp;
};

@ValidatorConstraint({ async: false })
export class IsValidUsernameConstraint implements ValidatorConstraintInterface {
	validate(username: string, args: ValidationArguments): boolean {
		const [options] = args.constraints as [IsValidUsernameOptions];
		// set sane defaults if no options are provided
		const {
			minLength = 4,
			maxLength = 15,
			allowedCharacters = /^[a-zA-Z0-9_]+$/,
		} = options;

		if (username.length < minLength || username.length > maxLength) {
			return false;
		}

		if (!allowedCharacters.test(username)) {
			return false;
		}

		return true;
	}

	defaultMessage(args: ValidationArguments) {
		return `Username ${args.value} is invalid`;
	}
}

export function IsValidUsername(
	options?: IsValidUsernameOptions,
	validationOptions?: ValidationOptions
) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [options],
			validator: IsValidUsernameConstraint,
		});
	};
}
