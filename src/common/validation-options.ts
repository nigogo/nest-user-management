const usernameOptions = {
	minLength: 4,
	maxLength: 16,
	allowedCharacters: /^[a-zA-Z0-9_]+$/,
};
const usernameMessage =
	'Username must be between 4 and 16 characters long and can only contain letters, numbers, and underscores';

const passwordOptions = {
	minLength: 8,
	maxLength: 64,
	minUppercase: 1,
	minNumbers: 1,
	minSymbols: 1,
};
const passwordMessage =
	'Password must be between 8 and 64 characters long and contain at least one uppercase letter, one number, and one special character';

export { usernameOptions, usernameMessage, passwordOptions, passwordMessage };
