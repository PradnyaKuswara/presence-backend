import { Module } from '@nestjs/common';
import { Setting } from './entities/setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingService } from './setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
