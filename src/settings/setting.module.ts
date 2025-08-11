import { Module } from '@nestjs/common';
import { Setting } from './entities/setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [],
  providers: [],
  exports: [],
})
export class SettingModule {}
