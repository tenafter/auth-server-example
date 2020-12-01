import { Request, Response, NextFunction } from 'express';
import {
    Middleware,
    ExpressErrorMiddlewareInterface,
} from 'routing-controllers';
import { logger } from './logger';
import { ServerError } from './error';

/**
 * Error Middleware
 */
@Middleware({ type: 'after' })
export class ServerErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, req: Request, res: Response, next: NextFunction): void {
        if (error instanceof ServerError == true) {
            logger.error(`[ServerError] ${error}`);
        } else {
            logger.error(`[UnknownError] ${error}`);
        }
        next(error);
    }
}
