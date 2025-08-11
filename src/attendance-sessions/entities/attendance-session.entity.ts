// src/attendance-sessions/entities/attendance-session.entity.ts
import { Attendance } from 'src/attendances/entities/attendance.entity';
import { School } from 'src/schools/entities/school.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
