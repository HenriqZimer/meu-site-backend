import { SetMetadata } from '@nestjs/common';

/**
 * Decorator para definir roles permitidas em uma rota
 *
 * Usado em conjunto com RolesGuard para controle de acesso
 *
 * Uso:
 * @Roles('admin')           // Apenas admin
 * @Roles('admin', 'moderator') // Admin OU moderador
 * @Post()
 * protectedRoute() {}
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
