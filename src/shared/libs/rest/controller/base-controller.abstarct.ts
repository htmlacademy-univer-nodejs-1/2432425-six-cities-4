import {inject, injectable} from 'inversify';
import {Response, Router} from 'express';
import {StatusCodes} from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import {ControllerInterface} from './controller.interface.js';
import { LoggerInterface } from '../../logger/logger.interface.js';
import { RouteInterface } from '../types/route.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { PathTransformer } from '../transform/path-transformer.js';

const DEFAULT_CONTENT_TYPE = 'application/json';
@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  @inject(AppComponent.PathTransformer)
  private pathTransformer!: PathTransformer;

  constructor(
    protected readonly logger: LoggerInterface
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: RouteInterface): void {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );

    const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  send<T>(res: Response, statusCode: number, data: T): void {
    const modifiedData = this.pathTransformer.execute(data as Record<string, unknown>);
    res
      .type(DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(modifiedData);
  }

  ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }
}
