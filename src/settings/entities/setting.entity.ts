import { AttendanceType } from 'src/enums/attendance-type.enum';
import { School } from 'src/schools/entities/school.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @Column({ unique: true, name: 'name_app' })
  nameApp: string;

  @Column({ unique: true, name: 'logo_app' })
  logoApp: string;

  @Column()
  school_id: number;

  @Column({
    type: 'enum',
    enum: AttendanceType,
    default: AttendanceType.DAILY,
    name: 'attendance_type',
  })
  attendanceType: AttendanceType;

  @Column({ type: 'time', name: 'check_in', default: '07:30:00' })
  checkIn: string;

  @Column({ type: 'time', name: 'check_out', default: '15:00:00' })
  checkOut: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => School, (school) => school.settings)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }
}
