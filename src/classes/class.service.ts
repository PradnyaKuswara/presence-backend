import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Repository } from 'typeorm';
import { ClassInput, ClassUpdateInput } from './dto/class.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  get(): Promise<Class[]> {
    return this.classRepository.find();
  }

  getAllBySchoolId(schoolId: number): Promise<Class[]> {
    return this.classRepository.find({
      where: { school: { id: schoolId } },
      relations: ['school'],
      order: { name: 'DESC' },
    });
  }

  getById(id: number): Promise<Class | null> {
    return this.classRepository.findOneBy({ id });
  }

  getByUuid(uuid: string): Promise<Class | null> {
    return this.classRepository.findOneBy({ uuid });
  }

  create(input: ClassInput): Promise<Class> {
    const newClass = this.classRepository.create(input);
    return this.classRepository.save(newClass);
  }

  async update(input: ClassUpdateInput): Promise<void> {
    const { uuid, ...rest } = input;

    const exist = await this.getByUuid(uuid);
    if (!exist) {
      throw new Error('Class not found');
    }

    await this.classRepository.update({ uuid }, rest);
  }

  async delete(uuid: string): Promise<void> {
    const exist = await this.getByUuid(uuid);
    if (!exist) {
      throw new Error('Class not found');
    }

    await this.classRepository.softDelete(exist.id);
  }
}
