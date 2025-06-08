import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../logger/logger.interface.js';
import HttpError from '../errors/http-error.js';
import { createErrorObject } from '../../../helpers/index.js';
import { ApplicationError } from '../types/application-error.enum.js';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`, error);

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
