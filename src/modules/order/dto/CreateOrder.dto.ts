import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class ItemOrderDTO {
  @IsUUID()
  productId: string;
  @IsInt()
  quantity: number;
}

export class OrderDTO {
  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ItemOrderDTO)
  itensOrder: ItemOrderDTO[];
}
