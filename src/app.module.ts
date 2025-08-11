// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './roles/role.module';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './classes/class.module';
import { StudentClassHistoryModule } from './student-class-histories/student-class-history.module';
import { AttendanceSessionModule } from './attendance-sessions/attendance-session.module';
import { AcademicYearModule } from './academic-years/academic-year.module';
import { SchoolModule } from './schools/school.module';
import { SettingModule } from './settings/setting.module';
import { AttendanceModule } from './attendances/attendance.module';
import { StudentModule } from './students/student.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      autoLoadEntities: true,
    }),
    RoleModule,
    AuthModule,
    ClassModule,
    StudentModule,
    AttendanceModule,
    SettingModule,
    SchoolModule,
    AcademicYearModule,
    AttendanceSessionModule,
    StudentClassHistoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
