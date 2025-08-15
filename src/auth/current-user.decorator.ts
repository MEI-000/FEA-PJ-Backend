import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentUser = createParamDecorator((key: string | undefined, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  // Adjust based on your JWT payload shape. Commonly { sub: userId, email: ... }
  return key ? req.user?.[key] : req.user;
});
