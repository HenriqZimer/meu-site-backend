import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { Public } from '../auth/decorators/public.decorator';

/**
 * Health Check Controller
 *
 * Endpoint público para monitoramento da saúde da aplicação
 * Usado por Kubernetes, Docker, ferramentas de monitoramento, etc.
 *
 * Verifica:
 * - Status da API (sempre UP se responder)
 * - Conexão com MongoDB
 * - Tempo de resposta
 *
 * Rota pública: Não requer autenticação (@Public decorator)
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongooseHealth: MongooseHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Health Check da API' })
  @ApiResponse({
    status: 200,
    description: 'Aplicação saudável',
    schema: {
      example: {
        status: 'ok',
        info: {
          mongodb: {
            status: 'up',
          },
        },
        details: {
          mongodb: {
            status: 'up',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Aplicação com problemas',
    schema: {
      example: {
        status: 'error',
        error: {
          mongodb: {
            status: 'down',
            message: 'Connection timeout',
          },
        },
      },
    },
  })
  check() {
    return this.health.check([
      // Verifica conexão com MongoDB
      // Timeout de 1500ms - se não responder, marca como down
      () => this.mongooseHealth.pingCheck('mongodb', { timeout: 1500 }),
    ]);
  }
}
