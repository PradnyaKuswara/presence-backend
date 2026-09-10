import { mappingRole } from 'src/roles/dto/role.dto';
import { Role } from 'src/roles/entities/role.entity';
import { mappingSchool } from 'src/schools/dto/school.dto';
import { School } from 'src/schools/entities/school.entity';
import { User } from 'src/users/entities/user.entity';

export type AuthUser = Pick<User, 'uuid' | 'email' | 'full_name'> & {
  role: Pick<Role, 'name'>;
  school: Pick<School, 'uuid' | 'name' | 'address' | 'email' | 'phone'> | null;
};

export type AuthUserPayload = Pick<
  User,
  'uuid' | 'email' | 'full_name' | 'isActive' | 'isEmailVerified' | 'avatar'
> & {
  role: Role;
  school?: School | null;
};

export function mappingAuthUser(user: User): AuthUser {
  return {
    uuid: user.uuid,
    email: user.email,
    full_name: user.full_name,
    role: mappingRole(user.role),
    school: user.school ? mappingSchool(user.school) : null,
  };
}

export function mappingAuthUserPayload(user: User): AuthUserPayload {
  return {
    uuid: user.uuid,
    email: user.email,
    full_name: user.full_name,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    avatar: user.avatar,
    role: user.role,
    school: user.school || null,
  };
}
