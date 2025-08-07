import { Controller, Post, Body, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { sendResponse } from 'src/helpers/response';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() input: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(input);
    const { access_token } = this.authService.login(user);

    return sendResponse<{ access_token: string }>(
      res,
      201,
      'succesfully created data',
      { access_token },
    );
  }
}
