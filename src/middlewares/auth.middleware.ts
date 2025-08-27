// src/common/middleware/auth.middleware.ts
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthUserPayload } from 'src/auth/dto/auth.dto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      if (typeof decoded === 'object' && decoded !== null) {
        req['user'] = decoded as AuthUserPayload;
        next();
      } else {
        throw new UnauthorizedException('Invalid token payload');
      }
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
