// src/attendance-sessions/entities/attendance-session.entity.ts
import { AcademicYear } from 'src/academic-years/entities/academic-year.entity';
import { Attendance } from 'src/attendances/entities/attendance.entity';
import { Class } from 'src/classes/entities/class.entity';
import { School } from 'src/schools/entities/school.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'attendance_sessions' })
export class AttendanceSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @OneToMany(() => Attendance, (attendance) => attendance.attendance_session)
  attendances: Attendance[];

  @ManyToOne(() => School, (school) => school.attendance_sessions)
  @JoinColumn({ name: 'school_id' })
  school: School;
  @Column()
  school_id: number;

  @ManyToOne(() => Class, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class | null;
  @Column({ nullable: true })
  class_id: number | null;

  @ManyToOne(() => AcademicYear, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'academic_year_id' })
  academic_year: AcademicYear | null;
  @Column({ nullable: true })
  academic_year_id: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date | null;
}
