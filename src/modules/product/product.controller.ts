import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UpdateProductDTO } from './dto/updateProduct.dto';
import { CreateProductDTO } from './dto/createProduct.dto';
import { ProdutoService } from './produto.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AuthenticationGuard } from '../authentication/authentication.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProdutoService) { }

  @Post()
  async createNewProduct(@Body() productData: CreateProductDTO) {
    const product = await this.productService.createProduct(
      productData,
    );

    return {
      message: 'Product sucessfully created',
      product: product,
    };
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(CacheInterceptor)
  async listProducts() {
    return this.productService.listProducts();
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() productData: UpdateProductDTO,
  ) {
    const product = await this.productService.updateProduct(
      id,
      productData,
    );

    return {
      message: 'Product sucessfully updated',
      product: product,
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const product = await this.productService.removeProduct(id);

    return {
      message: 'Product sucessfully removed',
      product: product,
    };
  }
}
