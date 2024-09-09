import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
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
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }
      // Generate JWT token
      const payload = { username: user.username, sub: user._id };
      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken, // Return the JWT token
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
