export const baseEmailTemplate = (title: string, body: string) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0ede6; font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a19;">
  <!-- Main Container -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0ede6;">
    <tr>
      <td align="center" style="padding: 20px;">
        <!-- Email Content Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 4px;">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #f5c03d; padding: 20px; border-radius: 4px 4px 0 0;">
              <img src="https://mostaza.co/assets/images/mostaza.png" alt="Mostaza Logo" style="max-width: 150px;">
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 20px; background-color: #ffffff;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f0eadb; padding: 20px; border-radius: 0 0 4px 4px;">
              <p style="margin: 0; color: #737373;">
                Mostaza - <a href="https://mostaza.co" style="color: #c28e0a; text-decoration: none;">mostaza.co</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
