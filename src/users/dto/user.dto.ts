import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  avatar?: string;
}

export type UserInput = Pick<
  User,
  | 'email'
  | 'full_name'
  | 'password'
  | 'phone'
  | 'avatar'
  | 'role_id'
  | 'school_id'
>;
