import { baseEmailTemplate } from './base.email';

export const userRegisteredReminderTemplate = () =>
  baseEmailTemplate(
    'Tu cuenta en Mostaza',
    `
  <h1>Estas teniendo problemas pare entrar con tu cuenta?</h1>
  <p>Hola, te enviamos este mail para recordarte que ya tenes tu cuenta en Mostaza.</p>
  <p>Podes ingresar con tu email entrando en el siguiente link: 
    <strong>
      <a href="https://mostaza.co/signin">Ingresar a Mostaza</a>
    </strong>
  </p>
  <p>O si no recordas tu contraseña, podes recuperarla ingresando en el siguiente link: 
    <strong>
      <a href="https://mostaza.co/signin">Recuperar contraseña</a>
    </strong>
  </p>
`,
  );
