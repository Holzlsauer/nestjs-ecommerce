import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDTO } from './dto/UpdateOrder.dto';
import { OrderDTO } from './dto/CreateOrder.dto';
import { AuthenticationGuard, RequestWithUser } from '../authentication/authentication.guard';

@Controller('order')
@UseGuards(AuthenticationGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  async createOrder(
    @Req() req: RequestWithUser,
    @Body() orderData: OrderDTO,
  ) {
    const userId = req.user.sub
    const order = await this.orderService.createOrder(
      userId,
      orderData,
    );
    return order;
  }

  @Get()
  async getUserOrders(@Req() req: RequestWithUser) {
    const userId = req.user.sub
    const orders = await this.orderService.getUserOrders(userId);

    return orders;
  }

  @Patch(':id')
  updateOrder(
    @Param('id') orderId: string,
    @Req() req: RequestWithUser,
    @Body() orderUpdateData: UpdateOrderDTO,
  ) {
    const userId = req.user.sub
    return this.orderService.updateOrder(orderId, userId, orderUpdateData);
  }
}
