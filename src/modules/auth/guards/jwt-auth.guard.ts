import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Guard de Autenticação JWT
 *
 * Protege rotas exigindo token JWT válido no header Authorization
 * Usa a JwtStrategy para validar e decodificar o token
 *
 * Uso:
 * @UseGuards(JwtAuthGuard)
 * create(@Body() dto, @Request() req) {
 *   console.log(req.user.id); // ID do usuário autenticado
 * }
 *
 * Para tornar uma rota pública:
 * @Public()
 * @Get('public-route')
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Verifica se a rota tem decorator @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Chama o AuthGuard padrão do Passport que usa JwtStrategy
    return super.canActivate(context);
  }
}
