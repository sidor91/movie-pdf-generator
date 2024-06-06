import { HttpException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ErrorHandlerService {
  handleError(
    serviceName: string,
    customMessage: string,
    originalMessage: string,
    status: number,
  ) {
    const logger = new Logger(serviceName);
    logger.error(customMessage);
    logger.error(originalMessage);
    throw new HttpException(`${customMessage}, (${originalMessage})`, status);
  }
}
