import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('student_logs')
export class StudentLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  student_id?: number;

  @ManyToOne(() => Student, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'student_id' })
  student?: Student;

  @Column({ nullable: true })
  performed_by_id?: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'performed_by_id' })
  performed_by?: User;

  @Column()
  action: string;

  @Column({ type: 'json', nullable: true })
  metadata?: {
    description?: string;
    before?: unknown;
    after?: unknown;
    [key: string]: any;
  };

  @Column({ nullable: true })
  ip_address?: string;

  @Column({ nullable: true })
  device?: string;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date | null;
}
