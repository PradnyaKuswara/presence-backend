import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { AcademicYear } from '../entities/academic-year.entity';

export type AcademicYearType = Pick<
  AcademicYear,
  'name' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export type AcademicYearInput = Pick<
  AcademicYear,
  'name' | 'school_id' | 'start_date' | 'end_date' | 'is_active'
>;

export type AcademicYearUpdateInput = Pick<
  AcademicYear,
  'name' | 'id' | 'start_date' | 'end_date' | 'is_active'
>;

export function mappingAcademicYear(input: AcademicYear): AcademicYearType {
  return {
    name: input.name,
    created_at: input.created_at,
    updated_at: input.updated_at,
    deleted_at: input.deleted_at,
  };
}

export class CreateAcademicYearDto {
  @IsNotEmpty()
  @MaxLength(9)
  name: string;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  end_date: string;
}

export class UpdateAcademicYearDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @MaxLength(9)
  name: string;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;
}

export class DeleteAcademicYearDto {
  @IsNotEmpty()
  id: number;
}
