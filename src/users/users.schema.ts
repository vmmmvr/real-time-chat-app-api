import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true }) // Enable timestamps (createdAt, updatedAt)
export class User extends Document {
  _id: Types.ObjectId; // Add this to explicitly declare the _id field

  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true }) // Make email unique and required
  email: string;

  @Prop({ required: true }) // Add password as required
  password: string;

  @Prop({ unique: true, required: true }) // Add unique and required username field
  username: string;

  // Array of friends referencing other users
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  friends: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
