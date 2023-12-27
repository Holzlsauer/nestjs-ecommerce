/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderDTO } from './dto/CreateOrder.dto';
import { UpdateOrderDTO } from './dto/UpdateOrder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { In, Repository } from 'typeorm';
import { StatusOrder } from './enum/statusOrder.enum';
import { ItemOrderEntity } from './itemOrder.entity';
import { UserEntity } from '../user/user.entity';
import { ProductEntity } from '../product/product.entity';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private logger: LoggerService
  ) { }

  private async findUser(id) {
    const user = await this.userRepository.findOneBy({ id });

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private orderDataOrganize(
    orderData: OrderDTO,
    relatedProducts: ProductEntity[],
  ) {
    orderData.itensOrder.forEach((itemOrder) => {
      const relatedProduct = relatedProducts.find(
        (produto) => produto.id === itemOrder.productId,
      );

      if (relatedProduct === undefined) {
        throw new NotFoundException(
          `Product id ${itemOrder.productId} not found`,
        );
      }

      if (itemOrder.quantity > relatedProduct.stock) {
        throw new BadRequestException(
          `Number of itens (${itemOrder.quantity}) is greater than the available (${relatedProduct.stock}) of product ${relatedProduct.name}.`,
        );
      }
    });
  }

  async createOrder(userId: string, orderData: OrderDTO) {
    const user = await this.findUser(userId);

    const productsIds = orderData.itensOrder.map(
      (itemOrder) => itemOrder.productId,
    );

    const relatedProducts = await this.productRepository.findBy({
      id: In(productsIds),
    });
    const pedidoEntity = new OrderEntity();

    pedidoEntity.status = StatusOrder.PROCESSING;
    pedidoEntity.user = user;

    this.orderDataOrganize(orderData, relatedProducts);

    const itensOrderEntities = orderData.itensOrder.map((itemOrder) => {
      const relatedProduct = relatedProducts.find(
        (product) => product.id === itemOrder.productId,
      );

      const itemOrderEntity = new ItemOrderEntity();

      itemOrderEntity.product = relatedProduct!;
      itemOrderEntity.sellPrice = relatedProduct!.value;

      itemOrderEntity.quantity = itemOrder.quantity;
      itemOrderEntity.product.stock -= itemOrder.quantity;

      const orderLog = this.logger.orderLog(
        itemOrderEntity.product.name,
        itemOrderEntity.quantity,
        itemOrderEntity.sellPrice
      )
      this.logger.log(orderLog)

      return itemOrderEntity;
    });

    const totalValue = itensOrderEntities.reduce((total, item) => {
      return total + item.sellPrice * item.quantity;
    }, 0);

    pedidoEntity.itensOrder = itensOrderEntities;

    pedidoEntity.totalPrice = totalValue;

    const order = await this.orderRepository.save(pedidoEntity);
    return order;
  }

  async getUserOrders(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user === null) {
      throw new NotFoundException('User not found')
    }

    return this.orderRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        user: true,
      },
    });
  }

  async updateOrder(id: string, userId: string, dto: UpdateOrderDTO) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { user: true }
    });

    if (order === null) {
      throw new NotFoundException('Order not found');
    }

    if (order.user.id !== userId) {
      throw new ForbiddenException(
        'Order cannot be updated by this user',
      );
    }

    Object.assign(order, dto as OrderEntity);

    return this.orderRepository.save(order);
  }
}
