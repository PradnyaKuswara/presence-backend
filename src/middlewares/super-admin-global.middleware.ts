import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ROLE } from 'src/constants/roleConstant';

@Injectable()
export class SuperAdminGlobalMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req['user'];
    if (!user) {
      throw new UnauthorizedException('User belum terautentikasi');
    }

    if (user?.role?.name !== ROLE.SUPER_ADMIN_GLOBAL) {
      throw new ForbiddenException(
        'Akses ditolak: Hanya Super Admin Global yang dapat mengakses resource ini',
      );
    }

    next();
  }
}
