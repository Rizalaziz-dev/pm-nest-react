import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // Validated by your JwtAuthGuard

    // If you use @User('id'), return just the ID. 
    // If you use @User(), return the whole object.
    return data ? user?.[data] : user;
  },
);