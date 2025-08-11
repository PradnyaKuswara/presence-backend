import { AcademicYear } from 'src/academic-years/entities/academic-year.entity';
import { AttendanceSession } from 'src/attendance-sessions/entities/attendance-session.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { StudentClassHistory } from 'src/student-class-histories/entities/student-class-history.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  logo: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.school)
  users: User[];

  @OneToMany(() => Class, (item) => item.school)
  classes: Class[];

  @OneToMany(() => AcademicYear, (item) => item.school)
  academic_years: AcademicYear[];

  @OneToMany(() => Setting, (setting) => setting.school)
  settings: Setting[];

  @OneToMany(() => AttendanceSession, (item) => item.school)
  attendance_sessions: AttendanceSession[];

  @OneToMany(() => StudentClassHistory, (item) => item.school)
  student_class_histories: StudentClassHistory[];

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }
}
