import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { GetUser } from 'src/lib/decorators/get-user.decorator';
import { User } from './users.schema';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth('accessToken')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async users(@GetUser() user: object) {
    const userData = await this.usersService.getUsers(user?.['sub']);
    return userData; // Return the current user from the JWT token
  }

  @UseGuards(JwtAuthGuard) // Protect route with JWT guard
  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Returns the current authenticated user',
    schema: { example: { userId: '123456', username: 'john_doe', email: 'john@example.com' } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@GetUser() user: object) {
    const userData = await this.usersService.getUser(user?.['sub']);
    return userData; // Return the current user from the JWT token
  }

  // Route to change the password
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(@GetUser() user: User, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(user, changePasswordDto);
  }
  // Add a friend using the logged-in user's username from req.user
  @UseGuards(JwtAuthGuard)
  @Post('friends/:friendUsername')
  @ApiResponse({ status: 200, description: 'Friend added successfully' })
  @ApiResponse({ status: 404, description: 'Friend not found' })
  async addFriend(
    @GetUser() user: User, // Get the logged-in user from req.user
    @Param('friendUsername') friendUsername: string,
  ) {
    // Use req.user.username for the main user's username
    return this.usersService.addFriend(user.username, friendUsername);
  }

  // Remove a friend using the logged-in user's username from req.user
  @UseGuards(JwtAuthGuard)
  @Delete('friends/:friendUsername')
  @ApiResponse({ status: 200, description: 'Friend removed successfully' })
  @ApiResponse({ status: 404, description: 'Friend not found' })
  async removeFriend(
    @GetUser() user: User, // Get the logged-in user from req.user
    @Param('friendUsername') friendUsername: string,
  ) {
    // Use req.user.username for the main user's username
    return this.usersService.removeFriend(user.username, friendUsername);
  }
}
