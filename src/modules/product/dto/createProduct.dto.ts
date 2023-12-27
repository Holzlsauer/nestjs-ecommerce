import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductEntity } from '../product.entity';

export class ProductDetailsDTO {
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  product: ProductEntity;
}

export class ProductImageDTO {
  id: string;

  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  product: ProductEntity;
}

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'The products price must be greater than 1.0' })
  value: number;

  @IsNumber()
  @Min(0, { message: 'The number of products in stock must be greater or equal to 0' })
  stock: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, {
    message: 'Description can\'t be longer than 1000 characters',
  })
  description: string;

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ProductDetailsDTO)
  details: ProductDetailsDTO[];

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ProductImageDTO)
  images: ProductImageDTO[];

  @IsString()
  @IsNotEmpty()
  category: string;
}
