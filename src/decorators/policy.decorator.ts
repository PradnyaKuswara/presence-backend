/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/auth/decorators/policy.decorator.ts
import { SetMetadata, Type } from '@nestjs/common';

export const POLICY_KEY = 'policy';

export interface PolicyMetadata {
  policyClass: any;
  action: string;
  paramKey: string;
  service: Type<any>; // <---- tambahin service
}

export const Policy = (
  policyClass: any,
  action: string,
  paramKey = 'uuid',
  service?: Type<any>,
) =>
  SetMetadata(POLICY_KEY, <PolicyMetadata>{
    policyClass,
    action,
    paramKey,
    service,
  });
