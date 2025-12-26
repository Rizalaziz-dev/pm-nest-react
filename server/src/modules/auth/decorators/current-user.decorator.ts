import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        // Switch the context to HTTP
        const request = ctx.switchToHttp().getRequest();

        // Return the user object that our JwtStrategy attached to the request
        return request.user;
    }
)