
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';

export const UserIdentity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const jwtService = new JwtService();
        const decodedToken = jwtService.decode(token);
        request.decodedToken = decodedToken;
        
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new UnauthorizedException('Invalid token');
        }
        throw new UnauthorizedException('Error decoding token');
      }
    } else {
      throw new UnauthorizedException('Token is missing in header');
    }
    
    return ({ admin_username: request.decodedToken.username });
  },
);
