import { ClassSerializerInterceptor, ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { PostgresConfigService } from './config/postgres.config.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './resources/filters/globalException.filter';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { GlobalLoggerInterceptor } from './resources/interceptors/globalLogger.interceptor';
import { LoggerService } from './modules/logger/logger.service';
import { LoggerModule } from './modules/logger/logger.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    UserModule,
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    OrderModule,
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({ ttl: 3600 * 1000 })
      }),
      isGlobal: true
    }),
    AuthenticationModule,
    LoggerModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalLoggerInterceptor
    },
    ConsoleLogger,
    LoggerService
  ],
})
export class AppModule { }
