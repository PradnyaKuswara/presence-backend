import { mappingUser, UserType } from 'src/users/dto/user.dto';
import { Role } from '../entities/role.entity';

export type RoleType = Pick<
  Role,
  'name' | 'createdAt' | 'updatedAt' | 'deletedAt'
> & {
  users: UserType[];
};

export function mappingRole(input: Role, withTimestamp = false): RoleType {
  const result: Partial<RoleType> = {
    name: input.name,
  };

  if (withTimestamp) {
    result.createdAt = input.createdAt;
    result.updatedAt = input.updatedAt;
    result.deletedAt = input.deletedAt;
  }

  if (input.users) {
    result.users = input.users.map((user) => mappingUser(user));
  }

  return result as RoleType;
}
