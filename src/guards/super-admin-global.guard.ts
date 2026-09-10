import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ROLE } from 'src/constants/roleConstant';

@Injectable()
export class SuperAdminGlobalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User belum terautentikasi');
    }

    if (user?.role?.name !== ROLE.SUPER_ADMIN_GLOBAL) {
      throw new ForbiddenException(
        'Akses ditolak: Hanya Super Admin Global yang dapat mengakses resource ini',
      );
    }

    return true;
  }
}
