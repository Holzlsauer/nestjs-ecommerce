import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../product/product.entity';
import { UserEntity } from '../user/user.entity';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, UserEntity, ProductEntity]),
    LoggerModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
