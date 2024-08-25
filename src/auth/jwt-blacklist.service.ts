import { Injectable } from '@nestjs/common';

export type BlacklistEntry = {
	jti: string;
	exp: number;
};

/*
A simple service to blacklist JWT tokens, it is needed to 'revoke' tokens before their expiration time.
Usually this would be implemented using in-memory storage (like Redis) to store the blacklisted tokens.
This service uses an in-memory Map for simplicity.
 */
@Injectable()
export class JwtBlacklistService {
	blacklist: Map<string, BlacklistEntry>;

	constructor() {
		this.blacklist = new Map();
	}

	blacklistToken({ jti, exp }: BlacklistEntry): void {
		this.blacklist.set(jti, { jti, exp });
	}

	isBlacklisted(jti: string): boolean {
		const entry = this.blacklist.get(jti);
		if (!entry) {
			return false;
		} else {
			// clean up expired tokens
			const currentTime = Math.floor(Date.now() / 1000);
			if (entry.exp < currentTime) {
				this.blacklist.delete(jti);
				return false;
			}
		}

		return true;
	}
}
