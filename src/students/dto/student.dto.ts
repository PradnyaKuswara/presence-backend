import {
  CreateStudentClassHistoryDto,
  mappingStudentClassHistory,
  StudentClassHistoryInput,
  StudentClassHistoryUpdateInput,
  UpdateStudentClassHistoryDto,
} from 'src/student-class-histories/dto/student-class-history.dto';
import { Student } from '../entities/student.entity';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

import { StudentClassHistoryType } from 'src/student-class-histories/dto/student-class-history.dto';
import { mappingSchool, SchoolType } from 'src/schools/dto/school.dto';

export type StudentType = Omit<
  Pick<
    Student,
    | 'uuid'
    | 'full_name'
    | 'nisn'
    | 'email'
    | 'avatar'
    | 'phone_number'
    | 'gender'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
  >,
  'student_class_histories'
> & {
  school: SchoolType;
  student_class_histories: StudentClassHistoryType[];
};

export type StudentCreateInput = Pick<
  Student,
  'full_name' | 'nisn' | 'email' | 'password' | 'phone_number' | 'gender'
> & {
  school_id: number;
  student_class_history: Omit<
    StudentClassHistoryInput,
    'student_id' | 'is_active'
  >;
};

export type StudentUpdateInput = Pick<
  Student,
  'full_name' | 'nisn' | 'email' | 'phone_number' | 'gender'
> & {
  uuid: string;
  student_class_history?: Omit<
    StudentClassHistoryUpdateInput,
    'student_id' | 'is_active'
  >;
};

export type StudentUpdateStatusInput = {
  uuid: string;
  is_active: boolean;
};

export class CreateStudentDto {
  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  nisn: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  @IsEnum(Gender, { message: 'gender must be either male or female' })
  gender: Gender;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateStudentClassHistoryDto)
  student_class_history: CreateStudentClassHistoryDto;
}

export class UpdateStudentDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  nisn: string;

  @IsEmail()
  email: string;

  avatar?: string | null;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  @IsEnum(Gender, { message: 'gender must be either male or female' })
  gender: Gender;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateStudentClassHistoryDto)
  student_class_history?: UpdateStudentClassHistoryDto | null;
}

export class UpdateStudentStatusDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  is_active: boolean;
}

export function mappingStudent(input: Student): StudentType {
  const result: Partial<StudentType> = {
    uuid: input.uuid,
    full_name: input.full_name,
    nisn: input.nisn,
    gender: input.gender,
    email: input.email,
    avatar: input.avatar,
    phone_number: input.phone_number,
    created_at: input.created_at,
    updated_at: input.updated_at,
    deleted_at: input.deleted_at,
  };

  if (input.student_class_histories) {
    result.student_class_histories = input.student_class_histories.map(
      mappingStudentClassHistory,
    );
  }

  if (input.school) {
    result.school = mappingSchool(input.school);
  }

  return result as StudentType;
}
