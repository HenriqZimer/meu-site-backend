import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard de Autorização por Roles
 *
 * Verifica se o usuário autenticado possui a role necessária para acessar a rota
 * DEVE ser usado APÓS JwtAuthGuard para ter acesso ao request.user
 *
 * Uso:
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('admin')
 * @Post('admin-only')
 * createAdminResource() {}
 *
 * Para permitir múltiplas roles:
 * @Roles('admin', 'moderator')
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Busca as roles requeridas pelo decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se não há roles definidas, permite acesso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Se não há usuário (não passou pelo JwtAuthGuard), nega acesso
    if (!user) {
      throw new ForbiddenException('Acesso negado: usuário não autenticado');
    }

    // Verifica se o usuário possui alguma das roles requeridas
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Acesso negado: necessário ter uma das roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
