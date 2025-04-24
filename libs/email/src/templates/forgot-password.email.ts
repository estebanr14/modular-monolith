import { baseEmailTemplate } from './base.email';

export const forgotPasswordEmailTemplate = (code: string, email: string) => {
  const link = `mostazaapp://forgot-password?code=${code}&email=${email}`;

  return baseEmailTemplate(
    'Olvidaste tu contraseña',
    `
  <h1>Olvidaste tu contraseña</h1>
  <p>Este email te llega porque solicitaste un codigo para recuperar tu contraseña.</p>
  <p>Entra al siguiente enlace desde tu telefono para seguir con el proceso de generar una nueva contraseña:</p>
  <p><strong><a href="${link}">${link}</a></strong></p>
  <p>Si no solicitaste este email lo podes ignorar.</p>
`,
  );
};
