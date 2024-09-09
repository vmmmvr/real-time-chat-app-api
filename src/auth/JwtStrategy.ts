// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/users.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Or from cookies if using cookies
      ignoreExpiration: false,
      secretOrKey: 'YOUR_SECRET_KEY', // Must match the secret key used for signing JWT
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.sub).select('username');
    return user; // This will attach the user object to the request
  }
}
