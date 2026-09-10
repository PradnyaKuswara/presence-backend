import { Role } from 'src/roles/entities/role.entity';
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

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @Column({ type: 'unsigned big int' })
  role_id: number;

  @Column({ type: 'unsigned big int', nullable: true, default: 0 })
  school_id?: number | null;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ nullable: true, type: 'varchar' })
  full_name?: string;

  @Column({ nullable: true, type: 'varchar' })
  phone?: string;

  @Column({ nullable: true, type: 'text' })
  avatar?: string;

  @Column({ default: true, type: 'boolean' })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => School, (school) => school.users, { nullable: true })
  @JoinColumn({ name: 'school_id' })
  school?: School | null;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }
}
