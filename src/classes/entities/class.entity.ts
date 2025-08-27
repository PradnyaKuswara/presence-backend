import { School } from 'src/schools/entities/school.entity';
import { StudentClassHistory } from 'src/student-class-histories/entities/student-class-history.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date | null;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'school_id' })
  school: School;
  @Column()
  school_id: number;

  @OneToMany(() => StudentClassHistory, (history) => history.class)
  student_class_histories: StudentClassHistory[];

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }
}
