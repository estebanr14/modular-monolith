import { baseEmailTemplate } from './base.email';

export const welcomeEmailTemplate = (code: string, email: string) => {
  const link = `mostazaapp://register?code=${code}&email=${email}`;

  return baseEmailTemplate(
    'Bienvenido a Mostaza',
    `
  <h1>Bienvenido a Mostaza</h1>
  <p>Que bueno que te nos unas!</p>
  <p>Entra al siguiente enlace desde tu telefono para seguir con el proceso de registro:</p>
  <p><strong><a href="${link}">${link}</a></strong></p>
  <p>Si no solicitaste este email lo podes ignorar.</p>
`,
  );
};
