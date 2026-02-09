import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

/**
 * JWT Strategy for Passport
 *
 * Valida tokens JWT e injeta o usuário no request.user
 * Usado automaticamente pelo JwtAuthGuard
 *
 * Segurança:
 * - Valida token JWT com secret do .env
 * - Verifica se usuário existe no banco
 * - Verifica se usuário está ativo
 * - Injeta payload completo no request para uso nos Guards
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET não está definido nas variáveis de ambiente');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Método chamado automaticamente após validação do token
   * @param payload - Dados decodificados do JWT (sub, username, role)
   * @returns Dados do usuário que serão injetados em request.user
   */
  async validate(payload: any) {
    // Buscar usuário no banco para garantir que ainda existe e está ativo
    const user = await this.userModel.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!user.active) {
      throw new UnauthorizedException('Usuário inativo');
    }

    // Este objeto será disponibilizado como request.user
    return {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    };
  }
}
