import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './users.schema';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    // Fetch the user from the database with the password field
    const userFromDb = await this.userModel.findById(user._id).select('+password').exec();

    if (!userFromDb) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, userFromDb.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid current password', HttpStatus.BAD_REQUEST);
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await this.userModel.updateOne({ _id: user._id }, { $set: { password: hashedNewPassword } });

    return {
      message: 'Password changed successfully',
    };
  }
  // Add a friend using username
  async addFriend(username: string, friendUsername: string): Promise<User> {
    // Find the current user by username
    const user = await this.userModel.findOne({ username }).select('-password');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Find the friend by username
    const friend = await this.userModel.findOne({ username: friendUsername });
    if (!friend) {
      throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);
    }

    // Check if the friend is already added
    const existingFriend = await this.userModel
      .findOne({ _id: user._id, friends: { $in: [friend._id] } })
      .lean()
      .exec();

    if (existingFriend) {
      throw new HttpException('Friend already added', HttpStatus.BAD_REQUEST);
    }

    // Update the user's friends list
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        user._id,
        { $addToSet: { friends: friend._id } }, // Use $addToSet to avoid duplicates
        { new: true }, // Return the updated document
      )
      .select('-password') // Exclude password from the updated user document
      .populate('friends', '-password'); // Populate friends without password

    return updatedUser;
  }

  // Remove a friend using username
  async removeFriend(username: string, friendUsername: string): Promise<User> {
    // Find the current user by username
    const user = await this.userModel.findOne({ username }).select('-password');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Find the friend by username
    const friend = await this.userModel.findOne({ username: friendUsername });
    if (!friend) {
      throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);
    }

    // Remove the friend from the user's friends list
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        user._id,
        { $pull: { friends: friend._id } }, // Remove the friend by ObjectId
        { new: true }, // Return the updated document
      )
      .select('-password') // Exclude password from the updated user document
      .populate('friends', '-password'); // Populate friends without password

    return updatedUser;
  }
}
