import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { School } from '../entities/school.entity';
import { ClassType, mappingClass } from 'src/classes/dto/class.dto';
import {
  AcademicYearType,
  mappingAcademicYear,
} from 'src/academic-years/dto/academic-year.dto';

export type SchoolType = Pick<
  School,
  | 'name'
  | 'address'
  | 'logo'
  | 'email'
  | 'phone'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'uuid'
  | 'users'
  | 'settings'
  | 'attendance_sessions'
> & {
  classes: ClassType[];
  academic_years: AcademicYearType[];
};

export class CreateSchoolDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsOptional()
  logo?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}

export function mappingSchool(input: School): SchoolType {
  const result: Partial<SchoolType> = {
    name: input.name,
    address: input.address,
    logo: input.logo,
    email: input.email,
    phone: input.phone,
    uuid: input.uuid,
    created_at: input.created_at,
    updated_at: input.updated_at,
    deleted_at: input.deleted_at,
  };
  if (input.users) {
    result.users = input.users;
  }

  if (input.classes) {
    result.classes = input.classes.map(mappingClass);
  }

  if (input.academic_years) {
    result.academic_years = input.academic_years.map(mappingAcademicYear);
  }

  if (input.settings) {
    result.settings = input.settings;
  }

  if (input.attendance_sessions) {
    result.attendance_sessions = input.attendance_sessions;
  }

  return result as SchoolType;
}
