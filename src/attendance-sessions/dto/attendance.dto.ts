import { SchoolType } from 'src/schools/dto/school.dto';
import { AttendanceSession } from '../entities/attendance-session.entity';

export type AttendaceSessionType = Pick<
  AttendanceSession,
  'id' | 'name' | 'start_time' | 'end_time'
> & {
  school: SchoolType;
};

export type AttendanceSessionCreateInput = Pick<
  AttendanceSession,
  'name' | 'start_time' | 'end_time' | 'school_id'
>;

export type AttendanceSessionUpdateInput =
  Partial<AttendanceSessionCreateInput> & { id: number };
