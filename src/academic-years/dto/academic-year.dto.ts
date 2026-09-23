import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AcademicYear } from '../entities/academic-year.entity';

export interface AcademicYearSchoolSummary {
  id: number;
  uuid: string;
  name: string;
  logo?: string;
}

export type AcademicYearType = Pick<
  AcademicYear,
  | 'id'
  | 'name'
  | 'start_date'
  | 'end_date'
  | 'is_active'
  | 'school_id'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
> & {
  school?: AcademicYearSchoolSummary;
};

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
    id: input.id,
    name: input.name,
    start_date: input.start_date,
    end_date: input.end_date,
    is_active: input.is_active,
    school_id: input.school_id,
    school: input.school
      ? {
          id: input.school.id,
          uuid: input.school.uuid,
          name: input.school.name,
          logo: input.school.logo || undefined,
        }
      : undefined,
    created_at: input.created_at,
    updated_at: input.updated_at,
    deleted_at: input.deleted_at,
  };
}

export class AcademicYearQueryDto {
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

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  school_id?: number;
}

export interface AcademicYearPaginatedResponseDto {
  data: AcademicYearType[];
  meta: {
    total: number;
    page: number;
    last_page: number;
    limit: number;
  };
}

export class CreateAcademicYearDto {
  @IsNotEmpty()
  @MaxLength(9)
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  school_id?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateAcademicYearDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @IsOptional()
  @MaxLength(9)
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  school_id?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class DeleteAcademicYearDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  id: number;
}
