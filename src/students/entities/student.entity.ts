import { ActivityLog } from 'src/activity-logs/entities/activity-logs.entity';
import { Class } from 'src/classes/entities/class.entity';
import { School } from 'src/schools/entities/school.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  nisn: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone_number?: string;

  @Column()
  school_id: number;

  @Column()
  class_id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => School, (school) => school.students)
  school: School;

  @ManyToOne(() => Class, (kelas) => kelas.students)
  class: Class;

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.student)
  activityLogs: ActivityLog[];

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }
}
