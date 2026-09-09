// src/attendances/entities/attendance.entity.ts
import { AttendanceSession } from 'src/attendance-sessions/entities/attendance-session.entity';
import { AttendanceStatus } from 'src/enums/attendance-status.enum';
import { StudentClassHistory } from 'src/student-class-histories/entities/student-class-history.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'attendances' })
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StudentClassHistory, (history) => history.attendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_class_history_id' })
  student_class_history: StudentClassHistory;
  @Column()
  student_class_history_id: number;

  @ManyToOne(() => AttendanceSession, (session) => session.attendances, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'attendance_session_id' })
  attendance_session: AttendanceSession | null;
  @Column({ nullable: true })
  attendance_session_id: number | null;

  @Column({ type: 'date' })
  attendance_date: string;

  @Column({ type: 'time', nullable: true })
  check_in: string | null;

  @Column({ type: 'time', nullable: true })
  check_out: string | null;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date | null;
}
