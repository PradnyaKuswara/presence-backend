import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { School } from '../entities/school.entity';
import { ClassType, mappingClass } from 'src/classes/dto/class.dto';
import {
  AcademicYearType,
  mappingAcademicYear,
} from 'src/academic-years/dto/academic-year.dto';

export type SchoolType = Pick<
  School,
  | 'id'
  | 'name'
  | 'address'
  | 'logo'
  | 'email'
  | 'phone'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'uuid'
> & {
  classes?: ClassType[];
  academic_years?: AcademicYearType[];
  users_count?: number;
  classes_count?: number;
  students_count?: number;
};

export class CreateSchoolDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}

export class UpdateSchoolDto {
  @IsOptional()
  @IsString()
  uuid?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  logo?: string;
}

export class SchoolQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}

export interface SchoolPaginatedResponseDto {
  data: SchoolType[];
  meta: {
    total: number;
    page: number;
    last_page: number;
    limit: number;
  };
}

export function mappingSchool(
  input: School & {
    students_count?: number;
    classes_count?: number;
    users_count?: number;
  },
): SchoolType {
  const result: SchoolType = {
    id: input.id,
    name: input.name,
    address: input.address,
    logo: input.logo,
    email: input.email,
    phone: input.phone,
    uuid: input.uuid,
    created_at: input.created_at,
    updated_at: input.updated_at,
    deleted_at: input.deleted_at,
    students_count:
      input.students_count !== undefined
        ? Number(input.students_count)
        : input.students
          ? input.students.length
          : 0,
    classes_count:
      input.classes_count !== undefined
        ? Number(input.classes_count)
        : input.classes
          ? input.classes.length
          : 0,
    users_count:
      input.users_count !== undefined
        ? Number(input.users_count)
        : input.users
          ? input.users.length
          : 0,
  };

  if (input.classes) {
    result.classes = input.classes.map(mappingClass);
  }

  if (input.academic_years) {
    result.academic_years = input.academic_years.map(mappingAcademicYear);
  }

  return result;
}
