import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'src/helpers/hash';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(input: LoginDto): Promise<User> {
    const user = await this.userService.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  login(USER: User): { access_token: string } {
    const payload = { email: USER.email, fullName: USER.full_name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
