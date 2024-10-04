import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './users.schema';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUsers(currentUserId?: string | null) {
    try {
      const currentUser = await this.userModel.findById(currentUserId).select('friends').exec();

      if (!currentUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      const firnedsIds = currentUser.friends.map((friend) => friend.toString());

      const users = await this.userModel
        .find({ _id: { $nin: [...firnedsIds, currentUser] } }, '_id, name email username') // Fetch all users
        .populate({
          path: 'friends', // 'friends' is a reference to the same User model
          select: 'name email username', // Only populate specific fields from friends
        })
        .exec(); // Execute the query

      return users;
    } catch (err: any) {
      throw new HttpException("Can't find these users", HttpStatus.BAD_REQUEST);
    }
  }
  async getUser(id: string) {
    try {
      const user = await this.userModel.findById(id).populate('friends').lean().exec();

      let filterCreteria = {};
      let allUserFriends;
      if (user.friends.length > 0) {
        const friendsIds = user.friends.map((friend) => friend.toString());
        filterCreteria['_id'] = { $in: [...friendsIds] };

        allUserFriends = await this.userModel
          .find(
            {
              ...filterCreteria,
            },
            '_id name username email',
          )
          .lean()
          .exec();
      }

      return { ...user, friends: allUserFriends };
    } catch (err: any) {
      console.log(err);

      throw new HttpException("Can't find this user", HttpStatus.BAD_REQUEST);
    }
  }
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
