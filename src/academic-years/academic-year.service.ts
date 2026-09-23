import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcademicYear } from './entities/academic-year.entity';
import { Repository } from 'typeorm';
import {
  AcademicYearPaginatedResponseDto,
  AcademicYearQueryDto,
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
  mappingAcademicYear,
} from './dto/academic-year.dto';
import { AuthUserPayload } from 'src/auth/dto/auth.dto';
import { ROLE } from 'src/constants/roleConstant';

@Injectable()
export class AcademicYearService {
  constructor(
    @InjectRepository(AcademicYear)
    private readonly academicYearRepository: Repository<AcademicYear>,
  ) {}

  async findAll(
    query: AcademicYearQueryDto,
    user?: AuthUserPayload,
  ): Promise<AcademicYearPaginatedResponseDto> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const qb = this.academicYearRepository
      .createQueryBuilder('ay')
      .leftJoinAndSelect('ay.school', 'school');

    if (user?.role?.name !== ROLE.SUPER_ADMIN_GLOBAL) {
      qb.andWhere('ay.school_id = :schoolId', {
        schoolId: user?.school?.id ?? 0,
      });
    } else if (query.school_id) {
      qb.andWhere('ay.school_id = :schoolId', {
        schoolId: Number(query.school_id),
      });
    }

    if (query.search && query.search.trim() !== '') {
      const search = `%${query.search.trim()}%`;
      qb.andWhere(
        '(LOWER(ay.name) LIKE LOWER(:search) OR LOWER(school.name) LIKE LOWER(:search))',
        { search },
      );
    }

    qb.orderBy('ay.start_date', 'DESC');
    qb.addOrderBy('ay.created_at', 'DESC');
    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();
    const last_page = Math.ceil(total / limit) || 1;

    return {
      data: items.map(mappingAcademicYear),
      meta: {
        total,
        page,
        last_page,
        limit,
      },
    };
  }

  async findDeleted(
    query: AcademicYearQueryDto,
    user?: AuthUserPayload,
  ): Promise<AcademicYearPaginatedResponseDto> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const qb = this.academicYearRepository
      .createQueryBuilder('ay')
      .withDeleted()
      .leftJoinAndSelect('ay.school', 'school')
      .where('ay.deleted_at IS NOT NULL');

    if (user?.role?.name !== ROLE.SUPER_ADMIN_GLOBAL) {
      qb.andWhere('ay.school_id = :schoolId', {
        schoolId: user?.school?.id ?? 0,
      });
    } else if (query.school_id) {
      qb.andWhere('ay.school_id = :schoolId', {
        schoolId: Number(query.school_id),
      });
    }

    if (query.search && query.search.trim() !== '') {
      const search = `%${query.search.trim()}%`;
      qb.andWhere(
        '(LOWER(ay.name) LIKE LOWER(:search) OR LOWER(school.name) LIKE LOWER(:search))',
        { search },
      );
    }

    qb.orderBy('ay.deleted_at', 'DESC');
    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();
    const last_page = Math.ceil(total / limit) || 1;

    return {
      data: items.map(mappingAcademicYear),
      meta: {
        total,
        page,
        last_page,
        limit,
      },
    };
  }

  async getById(id: number): Promise<AcademicYear | null> {
    return this.academicYearRepository.findOne({
      where: { id },
      relations: ['school'],
    });
  }

  async getAllBySchoolId(schoolId: number): Promise<AcademicYear[]> {
    return this.academicYearRepository.find({
      where: { school_id: schoolId },
      relations: ['school'],
      order: { start_date: 'DESC' },
    });
  }

  async create(
    dto: CreateAcademicYearDto,
    user: AuthUserPayload,
  ): Promise<AcademicYear> {
    const schoolId =
      user.role?.name === ROLE.SUPER_ADMIN_GLOBAL
        ? dto.school_id || user.school?.id || 0
        : user.school?.id || 0;

    if (!schoolId) {
      throw new BadRequestException('Sekolah (school_id) wajib ditentukan');
    }

    const existing = await this.academicYearRepository.findOne({
      where: { name: dto.name, school_id: schoolId },
    });
    if (existing) {
      throw new BadRequestException(
        `Tahun ajaran "${dto.name}" sudah ada di sekolah ini`,
      );
    }

    const isActive = dto.is_active ?? false;
    if (isActive) {
      await this.academicYearRepository.update(
        { school_id: schoolId, is_active: true },
        { is_active: false },
      );
    }

    const academicYear = this.academicYearRepository.create({
      name: dto.name,
      start_date: dto.start_date,
      end_date: dto.end_date,
      school_id: schoolId,
      is_active: isActive,
    });

    const saved = await this.academicYearRepository.save(academicYear);
    const result = await this.getById(saved.id);
    return result || saved;
  }

  async update(
    id: number,
    dto: UpdateAcademicYearDto,
    user?: AuthUserPayload,
  ): Promise<AcademicYear> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new NotFoundException('Tahun ajaran tidak ditemukan');
    }

    if (
      user &&
      user.role?.name !== ROLE.SUPER_ADMIN_GLOBAL &&
      user.school?.id !== existing.school_id
    ) {
      throw new BadRequestException('Akses ditolak untuk sekolah ini');
    }

    const targetSchoolId =
      dto.school_id && user?.role?.name === ROLE.SUPER_ADMIN_GLOBAL
        ? dto.school_id
        : existing.school_id;

    if (dto.name && dto.name !== existing.name) {
      const duplicate = await this.academicYearRepository.findOne({
        where: { name: dto.name, school_id: targetSchoolId },
      });
      if (duplicate && duplicate.id !== existing.id) {
        throw new BadRequestException(
          `Tahun ajaran "${dto.name}" sudah terdaftar`,
        );
      }
      existing.name = dto.name;
    }

    if (dto.start_date) existing.start_date = dto.start_date;
    if (dto.end_date) existing.end_date = dto.end_date;
    existing.school_id = targetSchoolId;

    if (dto.is_active !== undefined) {
      if (dto.is_active) {
        await this.academicYearRepository.update(
          { school_id: targetSchoolId, is_active: true },
          { is_active: false },
        );
      }
      existing.is_active = dto.is_active;
    }

    await this.academicYearRepository.save(existing);
    const updated = await this.getById(id);
    return updated || existing;
  }

  async setActive(id: number, user?: AuthUserPayload): Promise<AcademicYear> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new NotFoundException('Tahun ajaran tidak ditemukan');
    }

    if (
      user &&
      user.role?.name !== ROLE.SUPER_ADMIN_GLOBAL &&
      user.school?.id !== existing.school_id
    ) {
      throw new BadRequestException('Akses ditolak untuk sekolah ini');
    }

    await this.academicYearRepository.update(
      { school_id: existing.school_id, is_active: true },
      { is_active: false },
    );

    existing.is_active = true;
    await this.academicYearRepository.save(existing);
    return existing;
  }

  async delete(id: number): Promise<void> {
    const exist = await this.getById(id);
    if (!exist) {
      throw new NotFoundException('Tahun ajaran tidak ditemukan');
    }

    await this.academicYearRepository.softDelete(exist.id);
  }

  async restore(id: number): Promise<AcademicYear> {
    const existing = await this.academicYearRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: ['school'],
    });

    if (!existing) {
      throw new NotFoundException('Tahun ajaran tidak ditemukan');
    }

    if (!existing.deleted_at) {
      throw new BadRequestException(
        'Tahun ajaran ini tidak berstatus terhapus',
      );
    }

    await this.academicYearRepository.restore(id);
    const restored = await this.getById(id);
    return restored || existing;
  }
}
