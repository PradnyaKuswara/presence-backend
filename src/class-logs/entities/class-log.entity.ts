import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Class } from 'src/classes/entities/class.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('class_logs')
export class ClassLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  class_id?: number;

  @ManyToOne(() => Class, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'class_id' })
  class?: Class;

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
