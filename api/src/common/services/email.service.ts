import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: this.configService.get<boolean>('email.secure'),
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.password'),
      },
    });
  }

  async sendCredentials(email: string, password: string) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('email.from'),
        to: email,
        subject: 'Your MailCraftr Account Credentials',
        html: `
          <h2>Welcome to MailCraftr!</h2>
          <p>Your account has been created successfully.</p>
          <p><strong>Login Credentials:</strong></p>
          <ul>
            <li>Email: ${email}</li>
            <li>Password: ${password}</li>
          </ul>
          <p>Please change your password after your first login.</p>
        `,
      });
      this.logger.log(`Credentials email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}:`, error);
      throw error;
    }
  }
}
