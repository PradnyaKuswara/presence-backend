import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import 'dotenv/config';
import { RoleModule } from 'src/roles/role.module';
import { SchoolModule } from 'src/schools/school.module';
import { StudentModule } from 'src/students/student.module';
import { StudentClassHistoryModule } from 'src/student-class-histories/student-class-history.module';
@Module({
  imports: [
    UserModule,
    RoleModule,
    SchoolModule,
    StudentModule,
    StudentClassHistoryModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
