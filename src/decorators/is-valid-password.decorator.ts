import {
	registerDecorator,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
	ValidationOptions,
} from 'class-validator';

export type IsValidPasswordOptions = {
	minLength?: number;
	maxLength?: number;
	minUppercase?: number;
	minNumbers?: number;
	minSymbols?: number;
};

@ValidatorConstraint({ async: false })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
	validate(password: string, args: ValidationArguments): boolean {
		const [options] = args.constraints as [IsValidPasswordOptions];
		// set sane defaults if no options are provided
		const {
			minLength = 8,
			maxLength = 128,
			minUppercase = 1,
			minNumbers = 1,
			minSymbols = 1,
		} = options;

		if (password.length < minLength || password.length > maxLength) {
			return false;
		}

		const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
		if (uppercaseCount < minUppercase) {
			return false;
		}

		const numberCount = (password.match(/[0-9]/g) || []).length;
		if (numberCount < minNumbers) {
			return false;
		}

		const symbolCount = (password.match(/[^A-Za-z0-9]/g) || []).length;
		if (symbolCount < minSymbols) {
			return false;
		}

		return true;
	}

	defaultMessage() {
		// do not expose the password in the error message
		return `Password is invalid`;
	}
}

export function IsValidPassword(
	options?: IsValidPasswordOptions,
	validationOptions?: ValidationOptions
) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [options],
			validator: IsValidPasswordConstraint,
		});
	};
}
