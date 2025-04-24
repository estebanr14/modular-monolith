import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { Logger } from '@nestjs/common';

export const fetchSecrets = async (secretName: string) => {
  const client = new SecretsManagerClient({
    region: 'us-east-1',
  });

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      }),
    );
    return JSON.parse(response.SecretString);
  } catch (error) {
    const logger = new Logger(fetchSecrets.name);
    logger.error('Error fetching aws secrets');
    throw error;
  }
};
