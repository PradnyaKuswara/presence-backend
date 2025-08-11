import { StudentClassHistory } from 'src/student-class-histories/entities/student-class-history.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: 'male' | 'female';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => StudentClassHistory, (history) => history.student)
  student_class_histories: StudentClassHistory[];

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }
}
