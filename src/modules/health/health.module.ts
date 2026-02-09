import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

/**
 * Health Module
 *
 * Módulo responsável pelo Health Check da aplicação
 * Usa @nestjs/terminus para verificar saúde dos componentes
 */
@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
