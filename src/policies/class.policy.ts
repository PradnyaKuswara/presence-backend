// src/auth/policies/class.policy.ts

import { AuthUserPayload } from 'src/auth/dto/auth.dto';
import { Class } from 'src/classes/entities/class.entity';

export class ClassPolicy {
  static update(user: AuthUserPayload, resource: Class): boolean {
    return user.school?.id === resource.school_id;
  }

  static delete(user: AuthUserPayload, resource: Class): boolean {
    return user.school?.id === resource.school_id;
  }
}
