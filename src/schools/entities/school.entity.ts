import { AcademicYear } from 'src/academic-years/entities/academic-year.entity';
import { AttendanceSession } from 'src/attendance-sessions/entities/attendance-session.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { StudentClassHistory } from 'src/student-class-histories/entities/student-class-history.entity';
import { Student } from 'src/students/entities/student.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @Column({ unique: true, type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true, type: 'text' })
  logo: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date | null;

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

  @OneToMany(() => Student, (item) => item.school)
  students: Student[];

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }
}
