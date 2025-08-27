import { AcademicYear } from 'src/academic-years/entities/academic-year.entity';
import { AuthUserPayload } from 'src/auth/dto/auth.dto';

export class AcademicYearPolicy {
  static update(user: AuthUserPayload, resource: AcademicYear): boolean {
    return user.school.id === resource.school_id;
  }

  static delete(user: AuthUserPayload, resource: AcademicYear): boolean {
    return user.school.id === resource.school_id;
  }
}
