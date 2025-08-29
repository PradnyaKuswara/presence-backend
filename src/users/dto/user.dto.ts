import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
import { User } from '../entities/user.entity';
import { mappingRole, RoleType } from 'src/roles/dto/role.dto';
import { mappingSchool, SchoolType } from 'src/schools/dto/school.dto';

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

export type UserType = Pick<
  User,
  | 'email'
  | 'full_name'
  | 'phone'
  | 'avatar'
  | 'isActive'
  | 'isEmailVerified'
  | 'createdAt'
  | 'updatedAt'
> & {
  role: RoleType;
  school: SchoolType;
};

export function mappingUser(input: User): UserType {
  const result: Partial<UserType> = {
    email: input.email,
    full_name: input.full_name,
    phone: input.phone,
    avatar: input.avatar,
    isActive: input.isActive,
    isEmailVerified: input.isEmailVerified,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };

  if (input.role) {
    result.role = mappingRole(input.role);
  }

  if (input.school) {
    result.school = mappingSchool(input.school);
  }

  return result as UserType;
}
