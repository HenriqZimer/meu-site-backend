import { SetMetadata } from '@nestjs/common';

/**
 * Decorator para marcar rotas como públicas
 *
 * Quando aplicado, o JwtAuthGuard global permite acesso sem autenticação
 *
 * Uso:
 * @Public()
 * @Get('public-data')
 * getPublicData() {
 *   return { data: 'acessível sem token' };
 * }
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
