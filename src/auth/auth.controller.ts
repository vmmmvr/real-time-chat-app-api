import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from './JwtAuthGuard';
import { GetUser } from 'src/lib/decorators/get-user.decorator';
import { User } from 'src/users/users.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Route for user signup
  @Post('signup')
  @ApiBody({ type: SignupDto, description: 'User signup data' }) // Describes the body of the request
  @ApiResponse({ status: 201, description: 'User successfully registered' }) // Describes the successful response
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  // Route for user login
  @Post('login')
  @ApiBody({ type: LoginDto, description: 'User login data' }) // Describes the body of the request
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: { example: { message: 'Login successful', accessToken: 'jwt_token_here' } },
  }) // Example of a successful response
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken } = await this.authService.login(loginDto);

    // Set JWT token in an HttpOnly cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true, // Prevent access to the token from JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict', // Protects from CSRF
      maxAge: 60 * 60 * 1000, // Token expiration in milliseconds (1 hour)
    });

    return res.status(HttpStatus.OK).json({
      status: 200,
      message: 'succcessful login',
      data: { accessToken },
    });
  }
}
