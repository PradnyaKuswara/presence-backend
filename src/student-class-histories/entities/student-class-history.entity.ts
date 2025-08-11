// src/student-class-histories/entities/student-class-history.entity.ts
import { AcademicYear } from 'src/academic-years/entities/academic-year.entity';
import { Attendance } from 'src/attendances/entities/attendance.entity';
import { Class } from 'src/classes/entities/class.entity';
import { School } from 'src/schools/entities/school.entity';
import { Student } from 'src/students/entities/student.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'student_class_histories' })
export class StudentClassHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.student_class_histories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;
  @Column()
  student_id: number;

  @ManyToOne(() => Class, (cls) => cls.student_class_histories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;
  @Column()
  class_id: number;

  @ManyToOne(() => AcademicYear, (year) => year.student_class_histories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academic_year_id' })
  academic_year: AcademicYear;
  @Column()
  academic_year_id: number;

  @ManyToOne(() => School, (school) => school.student_class_histories)
  @JoinColumn({ name: 'school_id' })
  school: School;
  @Column()
  school_id: number;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date', nullable: true })
  end_date: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => Attendance, (attendance) => attendance.student_class_history)
  attendances: Attendance[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
