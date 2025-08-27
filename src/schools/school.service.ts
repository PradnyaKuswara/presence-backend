import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from './entities/school.entity';
import { Repository } from 'typeorm';
import { CreateSchoolDto } from './dto/school.dto';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
  ) {}

  async create(dto: CreateSchoolDto): Promise<School> {
    const school = this.schoolRepository.create(dto);
    return this.schoolRepository.save(school);
  }
}
