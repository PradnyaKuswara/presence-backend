import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async findBySchoolId(schoolId: number): Promise<Setting | null> {
    return this.settingRepository.findOne({
      where: { school_id: schoolId },
    });
  }

  async getSettingBySchoolId(schoolId: number): Promise<Setting> {
    const setting = await this.findBySchoolId(schoolId);
    if (!setting) {
      // Fallback default setting object if not explicitly created yet
      return this.settingRepository.create({
        school_id: schoolId,
        checkIn: '07:30:00',
        checkOut: '15:00:00',
        nameApp: 'Presence App',
        logoApp: 'logo.png',
      });
    }
    return setting;
  }
}
