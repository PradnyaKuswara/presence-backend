import { Controller, Post, Body, Req, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { sendResponse } from 'src/helpers/response';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthUser, mappingAuthUser } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private extractReqInfo(req: Request) {
    const ipHeader = req.headers['x-forwarded-for'];
    const ip = Array.isArray(ipHeader)
      ? ipHeader[0]
      : ipHeader || req.ip || req.socket.remoteAddress;
    const device = req.headers['user-agent'];
    return { ip, device };
  }

  @Post('login')
  async login(
    @Body() input: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const reqInfo = this.extractReqInfo(req);
    const user = await this.authService.validateUser(input);
    const { access_token } = await this.authService.login(user, reqInfo);

    return sendResponse<{ token: string }>(res, 200, 'Successfully logged in', {
      token: access_token,
    });
  }

  @Post('login/student')
  async loginStudent(
    @Body() input: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const reqInfo = this.extractReqInfo(req);
    const student = await this.authService.validateStudent(input);
    const { access_token } = await this.authService.loginStudent(
      student,
      reqInfo,
    );

    return sendResponse<{ access_token: string }>(
      res,
      200,
      'Successfully logged in',
      { access_token },
    );
  }

  @Post('login/admin-global')
  async loginAdminGlobal(
    @Body() input: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const reqInfo = this.extractReqInfo(req);
    const user = await this.authService.validateUserAdminGlobal(input);
    const { access_token } = await this.authService.loginUserAdminGlobal(
      user,
      reqInfo,
    );

    return sendResponse<{ token: string }>(res, 200, 'Successfully logged in', {
      token: access_token,
    });
  }

  @Post('register')
  async register(
    @Body() input: RegisterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const reqInfo = this.extractReqInfo(req);
    const user = await this.authService.register(input, reqInfo);

    return sendResponse<AuthUser>(
      res,
      201,
      'Successfully created data',
      mappingAuthUser(user),
    );
  }

  @Post('reset-password')
  async resetPassword(
    @Body() input: ResetPasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const reqInfo = this.extractReqInfo(req);
    await this.authService.resetPassword(input, reqInfo);

    return sendResponse(res, 200, 'Password successfully reset', null);
  }

  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    const user = req['user'];
    if (!user) {
      return sendResponse(res, 401, 'User not logged in', null);
    }
    return sendResponse(res, 200, 'User profile fetched successfully', user);
  }
}
