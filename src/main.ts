import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // ============================================================
  // SECURITY CONFIGURATION
  // ============================================================

  // Helmet: Proteção de headers HTTP (XSS, Clickjacking, MIME Sniffing)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false, // Permite Swagger funcionar
    }),
  );

  // CORS: Configurado com lista de origens permitidas
  const allowedOrigins = configService.get<string>('CORS_ORIGIN', '*');
  app.enableCors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (mobile apps, Postman)
      if (!origin) return callback(null, true);

      // Em produção, valida contra lista de origens permitidas
      if (allowedOrigins === '*') {
        logger.warn(
          '⚠️  CORS configurado para aceitar TODAS as origens. Configure CORS_ORIGIN no .env para produção!',
        );
        return callback(null, true);
      }

      const origins = allowedOrigins.split(',').map((o) => o.trim());
      if (origins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`🚫 CORS blocked origin: ${origin}`);
        callback(new Error('Origem não permitida pelo CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Accept',
  });

  // ============================================================
  // GLOBAL PIPES, FILTERS AND GUARDS
  // ============================================================

  // Global Exception Filter: Tratamento padronizado de erros
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Validation Pipe: Validação automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos não definidos nos DTOs
      transform: true, // Transforma tipos automaticamente
      forbidNonWhitelisted: true, // Lança erro se houver campos extras
      transformOptions: {
        enableImplicitConversion: true, // Converte strings para números/booleans
      },
    }),
  );

  // Global JWT Auth Guard: Protege todas as rotas por padrão
  // Use @Public() decorator para rotas públicas
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // ============================================================
  // API CONFIGURATION
  // ============================================================

  // API prefix: todas as rotas começam com /api
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Meu Site API')
    .setDescription('Documentação da API do Meu Site - Portfolio Backend')
    .setVersion('1.0')
    .addTag('auth', 'Autenticação e Autorização')
    .addTag('skills', 'Habilidades Técnicas')
    .addTag('projects', 'Projetos do Portfolio')
    .addTag('courses', 'Cursos Realizados')
    .addTag('certifications', 'Certificações')
    .addTag('contacts', 'Mensagens de Contato')
    .addTag('health', 'Health Check e Status')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtido via /api/auth/login',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ============================================================
  // START SERVER
  // ============================================================

  const port = configService.get<number>('BACKEND_PORT', 5000);
  await app.listen(port);

  logger.log('');
  logger.log('============================================================');
  logger.log('');
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
  logger.log(`🔒 Security: Helmet enabled, CORS configured`);
  logger.log(`🛡️  Authentication: JWT Guard enabled globally`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log('');
  logger.log('============================================================');
}

bootstrap();
