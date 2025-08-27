import { Type } from 'class-transformer';
import { ValidateNested, IsDefined } from 'class-validator';
import { CreateSchoolDto } from 'src/schools/dto/school.dto';
import { CreateUserDto } from 'src/users/dto/user.dto';

export class RegisterDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateSchoolDto)
  school: CreateSchoolDto;
}
