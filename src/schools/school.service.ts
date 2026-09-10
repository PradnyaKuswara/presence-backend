import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from './entities/school.entity';
import { Repository } from 'typeorm';
import {
  CreateSchoolDto,
  SchoolPaginatedResponseDto,
  SchoolQueryDto,
  UpdateSchoolDto,
  mappingSchool,
} from './dto/school.dto';

import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    private readonly storageService: StorageService,
  ) {}

  async findAll(query: SchoolQueryDto): Promise<SchoolPaginatedResponseDto> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const qb = this.schoolRepository
      .createQueryBuilder('school')
      .loadRelationCountAndMap('school.students_count', 'school.students')
      .loadRelationCountAndMap('school.classes_count', 'school.classes')
      .loadRelationCountAndMap('school.users_count', 'school.users');

    if (query.search && query.search.trim() !== '') {
      const search = `%${query.search.trim()}%`;
      qb.andWhere(
        '(LOWER(school.name) LIKE LOWER(:search) OR LOWER(school.email) LIKE LOWER(:search) OR LOWER(school.address) LIKE LOWER(:search) OR school.phone LIKE :search)',
        { search },
      );
    }

    qb.orderBy('school.created_at', 'DESC');
    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();
    const last_page = Math.ceil(total / limit) || 1;

    return {
      data: items.map(mappingSchool),
      meta: {
        total,
        page,
        last_page,
        limit,
      },
    };
  }

  async findOneByUuid(uuid: string): Promise<School> {
    const school = await this.schoolRepository
      .createQueryBuilder('school')
      .loadRelationCountAndMap('school.students_count', 'school.students')
      .loadRelationCountAndMap('school.classes_count', 'school.classes')
      .loadRelationCountAndMap('school.users_count', 'school.users')
      .where('school.uuid = :uuid', { uuid })
      .getOne();

    if (!school) {
      throw new NotFoundException('Sekolah tidak ditemukan');
    }

    if (
      school.id === 0 ||
      school.uuid === '00000000-0000-0000-0000-000000000000' ||
      school.name.trim().toLowerCase() === 'global system'
    ) {
      throw new BadRequestException('Global System cannot be accessed');
    }

    return school;
  }

  async create(
    dto: CreateSchoolDto,
    file?: Express.Multer.File,
  ): Promise<School> {
    const existing = await this.schoolRepository.findOne({
      where: [{ email: dto.email }, { name: dto.name }],
    });

    if (existing) {
      if (existing.email.toLowerCase() === dto.email.toLowerCase()) {
        throw new BadRequestException(
          'Sekolah dengan email ini sudah terdaftar',
        );
      }
      throw new BadRequestException('Sekolah dengan nama ini sudah terdaftar');
    }

    if (dto.name.trim().toLowerCase() === 'global system') {
      throw new BadRequestException(
        'Nama sekolah Global System dicadangkan untuk sistem',
      );
    }

    if (file) {
      dto.logo = await this.storageService.uploadFile(file, 'schools/logos');
    }

    const school = this.schoolRepository.create(dto);
    return this.schoolRepository.save(school);
  }

  async update(
    uuid: string,
    dto: UpdateSchoolDto,
    file?: Express.Multer.File,
  ): Promise<School> {
    const school = await this.schoolRepository.findOne({ where: { uuid } });
    if (!school) {
      throw new NotFoundException('Sekolah tidak ditemukan');
    }

    if (dto.email && dto.email.toLowerCase() !== school.email.toLowerCase()) {
      const emailExists = await this.schoolRepository.findOne({
        where: { email: dto.email },
      });
      if (emailExists && emailExists.id !== school.id) {
        throw new BadRequestException(
          'Email sudah digunakan oleh sekolah lain',
        );
      }
      school.email = dto.email;
    }

    if (dto.name && dto.name.toLowerCase() !== school.name.toLowerCase()) {
      const nameExists = await this.schoolRepository.findOne({
        where: { name: dto.name },
      });
      if (nameExists && nameExists.id !== school.id) {
        throw new BadRequestException('Nama sekolah sudah digunakan');
      }
      school.name = dto.name;
    }

    if (file) {
      if (school.logo) {
        await this.storageService.deleteFile(school.logo);
      }
      school.logo = await this.storageService.uploadFile(file, 'schools/logos');
    } else if (dto.logo !== undefined) {
      school.logo = dto.logo;
    }

    if (dto.address !== undefined) school.address = dto.address;
    if (dto.phone !== undefined) school.phone = dto.phone;

    await this.schoolRepository.save(school);
    return this.findOneByUuid(uuid);
  }

  async delete(uuid: string): Promise<void> {
    const school = await this.schoolRepository.findOne({ where: { uuid } });
    if (!school) {
      throw new NotFoundException('Sekolah tidak ditemukan');
    }

    if (
      school.id === 0 ||
      school.uuid === '00000000-0000-0000-0000-000000000000' ||
      school.name.trim().toLowerCase() === 'global system'
    ) {
      throw new BadRequestException(
        'Sekolah Global System tidak dapat dihapus',
      );
    }

    await this.schoolRepository.softDelete(school.id);
  }

  async findDeleted(
    query: SchoolQueryDto,
  ): Promise<SchoolPaginatedResponseDto> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const qb = this.schoolRepository
      .createQueryBuilder('school')
      .withDeleted()
      .loadRelationCountAndMap('school.students_count', 'school.students')
      .loadRelationCountAndMap('school.classes_count', 'school.classes')
      .loadRelationCountAndMap('school.users_count', 'school.users')
      .where('school.deleted_at IS NOT NULL');

    if (query.search && query.search.trim() !== '') {
      const search = `%${query.search.trim()}%`;
      qb.andWhere(
        '(LOWER(school.name) LIKE LOWER(:search) OR LOWER(school.email) LIKE LOWER(:search) OR LOWER(school.address) LIKE LOWER(:search) OR school.phone LIKE :search)',
        { search },
      );
    }

    qb.orderBy('school.deleted_at', 'DESC');
    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();
    const last_page = Math.ceil(total / limit) || 1;

    return {
      data: items.map(mappingSchool),
      meta: {
        total,
        page,
        last_page,
        limit,
      },
    };
  }

  async restore(uuid: string): Promise<School> {
    const school = await this.schoolRepository.findOne({
      where: { uuid },
      withDeleted: true,
    });

    if (!school) {
      throw new NotFoundException('Sekolah tidak ditemukan');
    }

    if (!school.deleted_at) {
      throw new BadRequestException('Sekolah ini tidak berstatus terhapus');
    }

    const conflict = await this.schoolRepository.findOne({
      where: [{ email: school.email }, { name: school.name }],
    });

    if (conflict && conflict.id !== school.id) {
      throw new BadRequestException(
        'Tidak dapat memulihkan: nama atau email sekolah sudah digunakan oleh sekolah lain yang aktif',
      );
    }

    await this.schoolRepository.restore(school.id);
    return this.findOneByUuid(uuid);
  }
}
