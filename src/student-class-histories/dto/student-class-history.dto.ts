import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { StudentClassHistory } from '../entities/student-class-history.entity';
import { ClassType, mappingClass } from 'src/classes/dto/class.dto';
import {
  AcademicYearType,
  mappingAcademicYear,
} from 'src/academic-years/dto/academic-year.dto';
import { mappingSchool, SchoolType } from 'src/schools/dto/school.dto';
import { mappingStudent, StudentType } from 'src/students/dto/student.dto';

export type StudentClassHistoryType = Pick<
  StudentClassHistory,
  'start_date' | 'end_date' | 'is_active' | 'created_at' | 'updated_at'
> & {
  class: ClassType;
  academic_year: AcademicYearType;
  school: SchoolType;
  student: StudentType;
};

export type StudentClassHistoryInput = Pick<
  StudentClassHistory,
  | 'student_id'
  | 'class_id'
  | 'academic_year_id'
  | 'school_id'
  | 'start_date'
  | 'end_date'
  | 'is_active'
>;

export type StudentClassHistoryUpdateInput = StudentClassHistoryInput & {
  id: number;
};

export class CreateStudentClassHistoryDto {
  @IsNotEmpty()
  class_id: number;

  @IsNotEmpty()
  academic_year_id: number;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;
}

export class UpdateStudentClassHistoryDto extends CreateStudentClassHistoryDto {
  @IsOptional()
  id: number;
}

export function mappingStudentClassHistory(
  input: StudentClassHistory,
): StudentClassHistoryType {
  const result: Partial<StudentClassHistoryType> = {
    start_date: input.start_date,
    end_date: input.end_date,
    is_active: input.is_active,
    created_at: input.created_at,
    updated_at: input.updated_at,
  };

  if (input.student) {
    result.student = mappingStudent(input.student);
  }
  if (input.class) {
    result.class = mappingClass(input.class);
  }
  if (input.academic_year) {
    result.academic_year = mappingAcademicYear(input.academic_year);
  }
  if (input.school) {
    result.school = mappingSchool(input.school);
  }

  return result as StudentClassHistoryType;
}
