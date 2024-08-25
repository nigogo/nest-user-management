import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import * as process from 'node:process';
import { User } from '../../interfaces/user.interface';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { JwtBlacklistService } from '../jwt-blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly jwtBlacklistService: JwtBlacklistService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate({ jti, sub, username }: JwtPayload): Promise<User> {
		const isBlacklisted = this.jwtBlacklistService.isBlacklisted(jti);

		if (isBlacklisted) {
			throw new UnauthorizedException('Token has been revoked');
		}

		return { id: sub, username };
	}
}
