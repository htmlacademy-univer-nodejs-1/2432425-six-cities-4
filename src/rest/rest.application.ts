import express, {Express} from 'express';
import {inject, injectable} from 'inversify';
import { LoggerInterface } from '../shared/libs/logger/logger.interface.js';
import { ConfigInterface } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { AppComponent } from '../shared/types/app-component.enum.js';
import { DatabaseClientInterface } from '../shared/libs/database-client/database-client.interface.js';
import { getMongoURI } from '../shared/helpers/database.js';
import { ExceptionFilterInterface } from '../shared/libs/rest/exception-filters/exception-filter.interface.js';
import { ControllerInterface } from '../shared/libs/rest/controller/controller.interface.js';
import { ParseTokenMiddleware } from '../shared/middleware/parse-token.middleware.js';

@injectable()
export default class Application {
  private expressApplication: Express;

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,
    @inject(AppComponent.ExceptionFilterInterface) private readonly exceptionFilter: ExceptionFilterInterface,
    @inject(AppComponent.UserController) private readonly userController: ControllerInterface,
    @inject(AppComponent.OfferController) private readonly offerController: ControllerInterface,
    @inject(AppComponent.CommentController) private readonly commentController: ControllerInterface,
    @inject(AppComponent.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilterInterface,
  ) {
    this.expressApplication = express();
  }

  private async _initRoutes() {
    this.logger.info('Controller initialization...');
    this.expressApplication.use('/users', this.userController.router);
    this.expressApplication.use('/offers', this.offerController.router);
    this.expressApplication.use('/comments', this.commentController.router);
    this.logger.info('Controller initialization completed');
  }

  private async _initExceptionFilters() {
    this.logger.info('Exception filter initialization');
    this.expressApplication.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.expressApplication.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    this.logger.info('Exception filters completed');
  }

  private async _initMiddleware() {
    this.logger.info('Global middleware initialization...');
    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));
    this.expressApplication.use(express.json());
    this.expressApplication.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.expressApplication.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.logger.info('Global middleware initialization completed');
  }

  private async _initServer() {
    this.logger.info('Try to init server...');

    const port = this.config.get('PORT');
    this.expressApplication.listen(port);

    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }

  private async _initDb() {
    this.logger.info('Init database ...');

    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(mongoUri);
    this.logger.info('Init database completed');
  }

  public async init() {
    this.logger.info('Application initialized');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    await this._initDb();
    await this._initMiddleware();
    await this._initRoutes();
    await this._initServer();
    await this._initExceptionFilters();
  }
}
