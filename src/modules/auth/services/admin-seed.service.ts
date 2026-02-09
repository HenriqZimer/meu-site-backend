import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';

/**
 * Admin Seed Service
 *
 * Garante que sempre exista ao menos um usuário administrador no sistema
 * Executado automaticamente na inicialização da aplicação (OnModuleInit)
 *
 * Comportamento:
 * 1. Verifica se existe ao menos um usuário com role 'admin'
 * 2. Se não existir, cria um admin com credenciais do .env
 * 3. Se ADMIN_USERNAME e ADMIN_PASSWORD não estiverem definidos, usa valores padrão
 *
 * IMPORTANTE:
 * - Em produção, SEMPRE defina ADMIN_USERNAME e ADMIN_PASSWORD no .env
 * - A senha é hasheada com bcrypt (10 rounds)
 * - O admin criado tem active: true por padrão
 *
 * Uso:
 * Este serviço é registrado no AuthModule e executa automaticamente no OnModuleInit
 */
@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  /**
   * Executado automaticamente quando o módulo é inicializado
   */
  async onModuleInit() {
    await this.seedAdminUser();
  }

  /**
   * Verifica e cria usuário admin se necessário
   */
  async seedAdminUser() {
    try {
      // Verifica se existe ao menos um admin
      const adminExists = await this.userModel.findOne({ role: 'admin' }).exec();

      if (adminExists) {
        this.logger.log('✅ Admin user already exists');
        return;
      }

      // Busca credenciais do admin no .env
      const adminUsername = this.configService.get<string>('ADMIN_USERNAME', 'admin');
      const adminPassword = this.configService.get<string>('ADMIN_PASSWORD', 'admin123');

      // Avisa se estiver usando credenciais padrão (inseguro)
      if (adminUsername === 'admin' || adminPassword === 'admin123') {
        this.logger.warn(
          '⚠️  Usando credenciais padrão para admin. Configure ADMIN_USERNAME e ADMIN_PASSWORD no .env para produção!',
        );
      }

      // Cria hash da senha com bcrypt (10 rounds)
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Verifica se já existe usuário com esse username (pode ser de outra role)
      const existingUser = await this.userModel.findOne({ username: adminUsername }).exec();

      if (existingUser) {
        this.logger.warn(
          `⚠️  Usuário '${adminUsername}' já existe com role '${existingUser.role}'. Não foi criado novo admin.`,
        );
        return;
      }

      // Cria o usuário admin
      const adminUser = new this.userModel({
        username: adminUsername,
        password: hashedPassword,
        role: 'admin',
        active: true,
      });

      await adminUser.save();

      this.logger.log(`✅ Admin user created successfully: ${adminUsername}`);
      this.logger.warn(
        `⚠️  IMPORTANTE: Altere a senha do admin após o primeiro login em produção!`,
      );
    } catch (error) {
      this.logger.error('❌ Error seeding admin user:', error);
      // Não lança erro para não impedir a inicialização da aplicação
      // mas registra o erro para investigação
    }
  }
}
