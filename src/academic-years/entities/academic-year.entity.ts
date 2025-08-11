// src/academic-years/entities/academic-year.entity.ts
import { School } from 'src/schools/entities/school.entity';
import { StudentClassHistory } from 'src/student-class-histories/entities/student-class-history.entity';
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

@Entity({ name: 'academic_years' })
export class AcademicYear {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 9, unique: true })
  name: string;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @OneToMany(() => StudentClassHistory, (history) => history.academic_year)
  student_class_histories: StudentClassHistory[];

  @ManyToOne(() => School, (school) => school.academic_years)
  @JoinColumn({ name: 'school_id' })
  school: School;
  @Column()
  school_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
