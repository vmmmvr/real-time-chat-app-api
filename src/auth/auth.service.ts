import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // User signup logic
  async signup(signupDto: SignupDto): Promise<any> {
    try {
      const { name, email, username, password } = signupDto;
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new this.userModel({ name, email, username, password: hashedPassword });

      await newUser.save();

      const addedUser = await this.userModel.findById(newUser._id).lean().exec();

      delete addedUser.password;
      return {
        user: addedUser,
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  // User login logic
  async login(loginDto: LoginDto): Promise<any> {
    try {
      const { email, password } = loginDto;

      // Find the user by email
      const user = await this.userModel.findOne({ email }).select('+password');
      if (!user) {
        throw new HttpException('Invalid email or password', HttpStatus.BAD_REQUEST);
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException('Invalid email or password', HttpStatus.BAD_REQUEST);
      }

      // Generate access token
      const payload = { username: user.username, id: user._id };
      const secret = this.configService.get<string>('JWT_SECRET');
      const accessToken = this.jwtService.sign(payload, {
        secret: secret,
        expiresIn: '15m', // Short-lived access token
      });

      // Generate refresh token
      const refreshToken = this.jwtService.sign(payload, {
        secret: secret,
        expiresIn: '7d', // Longer-lived refresh token
      });

      // Store the hashed refresh token in the database
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.userModel.findByIdAndUpdate(user._id, { refreshToken: hashedRefreshToken });

      return {
        accessToken, // Return the JWT access token
        refreshToken, // Return the JWT refresh token
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async refreshToken(oldRefreshToken: string): Promise<any> {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: secret,
      });

      // Find the user by the ID in the token
      const user = await this.userModel.findById(payload.id).select('+refreshToken');
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }

      // Verify that the refresh token matches the one stored in the database
      const isRefreshTokenValid = await bcrypt.compare(oldRefreshToken, user.refreshToken);
      if (!isRefreshTokenValid) {
        throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
      }

      // Generate a new access token
      const newAccessToken = this.jwtService.sign({ username: user.username, id: user._id }, { secret: secret, expiresIn: '15m' });

      return { accessToken: newAccessToken };
    } catch (error: any) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}
