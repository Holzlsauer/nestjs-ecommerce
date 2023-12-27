import { CallHandler, ConsoleLogger, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { RequestWithUser } from 'src/modules/authentication/authentication.guard';

@Injectable()
export class GlobalLoggerInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp()
    const request = httpContext.getRequest<Request | RequestWithUser>()

    const { path, method } = request
    const { statusCode } = httpContext.getResponse<Response>()
    const instantPreController = Date.now()

    return next.handle().pipe(
      tap(() => {
        if ('user' in request) {
          this.logger.log(`${statusCode} ${method} at ${path} by ${request.user.sub} \x1b[33m${Date.now() - instantPreController}ms`)
        } else {
          this.logger.log(`${statusCode} ${method} at ${path} \x1b[33m${Date.now() - instantPreController}ms`)
        }
      })
    )
  }
}
