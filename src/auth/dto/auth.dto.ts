import { Role } from 'src/roles/entities/role.entity';
import { School } from 'src/schools/entities/school.entity';
import { User } from 'src/users/entities/user.entity';

export type AuthUser = Pick<User, 'uuid' | 'email' | 'full_name'> & {
  role: Pick<Role, 'id' | 'name'>;
  school: Pick<School, 'uuid' | 'name' | 'address' | 'email' | 'phone'>;
};

export type AuthUserPayload = Pick<
  User,
  'uuid' | 'email' | 'full_name' | 'isActive' | 'isEmailVerified' | 'avatar'
> & {
  role: Role;
  school: School;
};

export function mappingAuthUser(user: User): AuthUser {
  return {
    uuid: user.uuid,
    email: user.email,
    full_name: user.full_name,
    role: {
      id: user.role.id,
      name: user.role.name,
    },
    school: {
      uuid: user.school.uuid,
      name: user.school.name,
      address: user.school.address,
      email: user.school.email,
      phone: user.school.phone,
    },
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
    school: user.school,
  };
}
