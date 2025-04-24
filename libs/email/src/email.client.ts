import { CONFIG, Config } from '@app/config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class EmailClient {
  private readonly logger = new Logger(EmailClient.name);

  constructor(@Inject(CONFIG) private readonly config: Config) {
    SendGrid.setApiKey(this.config.sendgridApiKey);
  }

  async send(mail: MailDataRequired): Promise<void> {
    await SendGrid.send(mail);

    this.logger.log(
      `[Email client] E-Mail with subject ${mail.subject} sent to ${maskEmail(mail.to.toString())}`,
    );

    function maskEmail(email: string): string {
      const [localPart, domain] = email.split('@');
      const maskedLocalPart =
        localPart.slice(0, 2) + '***' + localPart.slice(-1);
      return `${maskedLocalPart}@${domain}`;
    }
  }
}
