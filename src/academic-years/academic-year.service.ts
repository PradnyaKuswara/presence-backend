import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcademicYear } from './entities/academic-year.entity';
import { Repository } from 'typeorm';
import {
  AcademicYearInput,
  AcademicYearUpdateInput,
} from './dto/academic-year.dto';

@Injectable()
export class AcademicYearService {
  constructor(
    @InjectRepository(AcademicYear)
    private readonly academicYearRepository: Repository<AcademicYear>,
  ) {}

  async getAllBySchoolId(schoolId: number): Promise<AcademicYear[]> {
    return this.academicYearRepository.find({
      where: { school_id: schoolId },
      order: { start_date: 'DESC' },
    });
  }

  getById(id: number): Promise<AcademicYear | null> {
    return this.academicYearRepository.findOneBy({ id });
  }

  create(input: AcademicYearInput): Promise<AcademicYear> {
    const newAcademicYear = this.academicYearRepository.create(input);
    return this.academicYearRepository.save(newAcademicYear);
  }

  async update(input: AcademicYearUpdateInput): Promise<void> {
    const { id, ...rest } = input;

    const exist = await this.getById(id);
    if (!exist) {
      throw new Error('Academic Year not found');
    }

    await this.academicYearRepository.update({ id }, rest);
  }

  async delete(id: number): Promise<void> {
    const exist = await this.getById(id);
    if (!exist) {
      throw new Error('Academic Year not found');
    }

    await this.academicYearRepository.softDelete(exist.id);
  }
}
