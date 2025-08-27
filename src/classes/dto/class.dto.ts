import { IsNotEmpty, IsUUID } from 'class-validator';
import { Class } from '../entities/class.entity';

export type ClassType = Pick<
  Class,
  'name' | 'created_at' | 'updated_at' | 'deleted_at' | 'uuid'
>;

export class CreateClassDto {
  @IsNotEmpty()
  name: string;
}

export class UpdateClassDto {
  @IsNotEmpty()
  @IsUUID()
  uuid: string;

  @IsNotEmpty()
  name: string;
}

export class DeleteClassDto {
  @IsNotEmpty()
  @IsUUID()
  uuid: string;
}

export type ClassInput = Pick<Class, 'name' | 'school_id'>;
export type ClassUpdateInput = Pick<Class, 'name' | 'uuid'>;

export function mappingClass(input: Class): ClassType {
  return {
    name: input.name,
    uuid: input.uuid,
    created_at: input.created_at,
    updated_at: input.updated_at,
    deleted_at: input.deleted_at,
  };
}
