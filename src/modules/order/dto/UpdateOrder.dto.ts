import { IsEnum } from 'class-validator';
import { StatusOrder } from '../enum/statusOrder.enum';

export class UpdateOrderDTO {
  @IsEnum(StatusOrder)
  status: StatusOrder;
}
