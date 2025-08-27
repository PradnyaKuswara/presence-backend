// src/app.module.ts
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          autoLoadEntities: true,
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        const dataSource = addTransactionalDataSource(new DataSource(options));
        await dataSource.initialize();
        return dataSource;
      },
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'classes', method: RequestMethod.ALL },
        { path: 'academic-years', method: RequestMethod.ALL },
        { path: 'students/*', method: RequestMethod.ALL },
      );
  }
}
