import { baseEmailTemplate } from './base.email';

export const mfaEmailTemplate = (code: string) =>
  baseEmailTemplate(
    'Tu codigo para ingresar',
    `
  <h1>Tu codigo para ingresar</h1>
  <p>Vuelve a la pagina de login e ingresa este codigo para continuar:<p><br/>
  <div style="background-color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; font-size: 1.125rem;">${code}</div>
`,
  );
