import { baseEmailTemplate } from './base.email';

export const testEmailTemplate = (to) =>
  baseEmailTemplate(
    'Test Email',
    `
  <h1>Test email</h1>
  <p>This is a test email sent to ${to}</p>
  <p>Best regards,<br>Your Company</p>
`,
  );
