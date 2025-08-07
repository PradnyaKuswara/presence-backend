import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ActivityAction } from 'src/enums/activity-action.enum';
import { Student } from 'src/students/entities/student.entity';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ActivityAction })
  action: ActivityAction;

  @Column({ nullable: true })
  user_id?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ nullable: true })
  student_id?: number;

  @ManyToOne(() => Student, { nullable: true })
  @JoinColumn({ name: 'student_id' })
  student?: Student;

  @Column({ type: 'json', nullable: true })
  metadata: {
    description?: string;
    before?: unknown;
    after?: unknown;
  };

  @Column({ nullable: true })
  ip_address: string;

  @Column({ nullable: true })
  device: string;

  @CreateDateColumn()
  timestamp: Date;
}
