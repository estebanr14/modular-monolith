import { Provider } from '@nestjs/common';
import { RmqSenderService } from '../rmq-sender.service';
import { ClientProxy } from '@nestjs/microservices';
import { BACKEND_QUEUE_CLIENT } from '../rabbit-mq.module';
import { BACKOFFICE_QUEUE_CLIENT } from '../rabbit-mq.module';

export const RmqSenderServiceProvider = {
  provide: RmqSenderService,
  useFactory: (backendQueue: ClientProxy, backofficeQueue: ClientProxy) =>
    new RmqSenderService(backendQueue, backofficeQueue),
  inject: [BACKEND_QUEUE_CLIENT, BACKOFFICE_QUEUE_CLIENT],
};

const RmqProviders: Provider[] = [RmqSenderServiceProvider];

export default RmqProviders;
