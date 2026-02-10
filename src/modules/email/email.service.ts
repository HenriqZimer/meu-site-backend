import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly from: string;

  constructor(private configService: ConfigService) {
    this.from = this.configService.get<string>('SMTP_FROM') || 'noreply@example.com';

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT') || 587,
      secure: this.configService.get<boolean>('SMTP_SECURE') === true,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  /**
   * Envia notificação para o admin quando há novo contato
   */
  async sendContactNotification(contactData: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    createdAt: Date;
  }): Promise<boolean> {
    try {
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL');

      if (!adminEmail) {
        this.logger.warn('Admin email not configured. Skipping notification.');
        return false;
      }

      const html = this.getContactNotificationTemplate(contactData);

      await this.transporter.sendMail({
        from: this.from,
        to: adminEmail,
        subject: `[Portfolio] Nova mensagem de ${contactData.name}`,
        html,
      });

      this.logger.log(`Contact notification sent to ${adminEmail}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to send contact notification:', error);
      return false;
    }
  }

  /**
   * Template HTML para notificação de contato
   */
  private getContactNotificationTemplate(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    createdAt: Date;
  }): string {
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(data.createdAt);

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nova Mensagem de Contato</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: #ffffff;
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 32px 24px;
          }
          .info-section {
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin-bottom: 24px;
            border-radius: 8px;
          }
          .info-row {
            display: flex;
            margin-bottom: 12px;
          }
          .info-row:last-child {
            margin-bottom: 0;
          }
          .info-label {
            font-weight: 600;
            color: #475569;
            min-width: 100px;
            font-size: 14px;
          }
          .info-value {
            color: #1e293b;
            font-size: 14px;
            word-break: break-word;
          }
          .info-value a {
            color: #3b82f6;
            text-decoration: none;
          }
          .info-value a:hover {
            text-decoration: underline;
          }
          .message-section {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
          }
          .message-section h2 {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
          }
          .message-text {
            color: #475569;
            line-height: 1.6;
            font-size: 14px;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .action-section {
            text-align: center;
            padding: 24px 0;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
            transition: all 0.2s ease;
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          }
          .footer {
            background-color: #f8fafc;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer p {
            color: #64748b;
            font-size: 13px;
            line-height: 1.5;
          }
          .timestamp {
            color: #94a3b8;
            font-size: 13px;
            margin-top: 8px;
          }
          @media only screen and (max-width: 600px) {
            body {
              padding: 10px;
            }
            .header {
              padding: 24px 16px;
            }
            .content {
              padding: 24px 16px;
            }
            .info-row {
              flex-direction: column;
            }
            .info-label {
              margin-bottom: 4px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Nova Mensagem de Contato</h1>
            <p>Você recebeu uma nova mensagem através do seu portfólio</p>
          </div>

          <div class="content">
            <div class="info-section">
              <div class="info-row">
                <span class="info-label">Nome:</span>
                <span class="info-value">${data.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">E-mail:</span>
                <span class="info-value"><a href="mailto:${data.email}">${data.email}</a></span>
              </div>
              ${
                data.subject
                  ? `
              <div class="info-row">
                <span class="info-label">Assunto:</span>
                <span class="info-value">${data.subject}</span>
              </div>
              `
                  : ''
              }
              <div class="info-row">
                <span class="info-label">Data:</span>
                <span class="info-value">${formattedDate}</span>
              </div>
            </div>

            <div class="message-section">
              <h2>Mensagem:</h2>
              <div class="message-text">${data.message}</div>
            </div>

            <div class="action-section">
              <a href="mailto:${data.email}?subject=Re: ${data.subject || 'Contato'}" class="btn">
                Responder por E-mail
              </a>
            </div>
          </div>

          <div class="footer">
            <p>Esta é uma notificação automática do sistema de contato do seu portfólio.</p>
            <p class="timestamp">Enviado em ${formattedDate}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
