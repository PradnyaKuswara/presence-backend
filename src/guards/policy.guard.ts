/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector, ModuleRef } from '@nestjs/core';
import { POLICY_KEY, PolicyMetadata } from '../decorators/policy.decorator';
import { isUUID } from 'class-validator';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata =
      this.reflector.get<PolicyMetadata>(POLICY_KEY, context.getHandler()) ||
      {};

    if (!metadata.policyClass) return true;

    const { policyClass, action, paramKey, service } = metadata;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const identifier = request.body?.[paramKey] || request.params?.[paramKey];
    if (!identifier)
      throw new ForbiddenException('Resource identifier not provided');

    const serviceInstance = this.moduleRef.get(service, { strict: false });
    if (!serviceInstance) {
      throw new ForbiddenException(`Service not found`);
    }

    let resource: any;

    if (isUUID(identifier)) {
      if (typeof serviceInstance.getByUuid !== 'function') {
        throw new ForbiddenException(`Service does not implement`);
      }
      resource = await serviceInstance.getByUuid(identifier);
    } else if (!isNaN(Number(identifier))) {
      if (typeof serviceInstance.getById !== 'function') {
        throw new ForbiddenException(`Service does not implement`);
      }
      resource = await serviceInstance.getById(Number(identifier));
    } else {
      throw new ForbiddenException('Invalid identifier format');
    }

    if (!resource) throw new ForbiddenException('Resource not found');

    const allowed = policyClass[action](user, resource);
    if (!allowed) {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }
}
