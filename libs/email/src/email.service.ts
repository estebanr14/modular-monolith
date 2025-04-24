import { Inject, Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import { EmailClient } from './email.client';
import { CONFIG, Config } from '@app/config';

import {
  welcomeEmailTemplate,
  testEmailTemplate,
  mfaEmailTemplate,
  forgotPasswordEmailTemplate,
  userRegisteredReminderTemplate,
} from './templates';

@Injectable()
export class EmailService {
  private readonly defaultFrom: string;

  constructor(
    private readonly emailClient: EmailClient,
    @Inject(CONFIG) private readonly config: Config,
  ) {
    this.defaultFrom = this.config.emailFrom;
  }

  async sendTestEmail(
    recipient: string,
    from = this.defaultFrom,
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      from,
      subject: 'Test email',
      html: testEmailTemplate(recipient),
      text: 'Test email',
    };
    await this.emailClient.send(mail);
  }

  async sendMFAEmail(
    recipient: string,
    code: string,
    from = this.defaultFrom,
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      from,
      subject: 'MFA Code',
      html: mfaEmailTemplate(code),
      text: `MFA code: ${code}`,
    };
    await this.emailClient.send(mail);
  }

  async sendWelcomeEmail(recipient: string, signupCode: string): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      from: this.defaultFrom,
      subject: 'Bienvenido',
      html: welcomeEmailTemplate(signupCode, recipient),
      text: 'Bienvenido',
    };
    await this.emailClient.send(mail);
  }

  async sendForgotPasswordEmail(
    recipient: string,
    code: string,
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      from: this.defaultFrom,
      subject: 'Recupera tu contraseña',
      html: forgotPasswordEmailTemplate(code, recipient),
      text: `Recupera tu contraseña: ${code}`,
    };
    await this.emailClient.send(mail);
  }

  async sendUserRegisteredReminderEmail(recipient: string): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      from: this.defaultFrom,
      subject: 'Intento de ingreso',
      html: userRegisteredReminderTemplate(),
      text: 'Ya tenes una cuenta creada, proba ingresar con tu email o recuperar tu contraseña',
    };
    await this.emailClient.send(mail);
  }
}
