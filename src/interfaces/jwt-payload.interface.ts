export interface JwtPayload {
	jti: string;
	sub: number;
	username: string;
	exp?: number;
}
