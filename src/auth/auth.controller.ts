import { Controller, Post, Body, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { sendResponse } from 'src/helpers/response';
import { RegisterDto } from './dto/register.dto';
import { AuthUser, mappingAuthUser } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() input: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(input);
    const { access_token } = this.authService.login(user);

    return sendResponse<{ access_token: string }>(
      res,
      200,
      'succesfully Login',
      { access_token },
    );
  }

  @Post('login/student')
  async loginStudent(@Body() input: LoginDto, @Res() res: Response) {
    const student = await this.authService.validateStudent(input);
    const { access_token } = await this.authService.loginStudent(student);

    return sendResponse<{ access_token: string }>(
      res,
      200,
      'succesfully Login',
      { access_token },
    );
  }

  @Post('register')
  async register(@Body() input: RegisterDto, @Res() res: Response) {
    const user = await this.authService.register(input);
    console.log(user);
    return sendResponse<AuthUser>(
      res,
      201,
      'succesfully created data',
      mappingAuthUser(user),
    );
  }
}
