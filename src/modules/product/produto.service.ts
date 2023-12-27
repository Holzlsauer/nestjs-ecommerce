import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListProductDTO } from './dto/listProduct.dto';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDTO } from './dto/updateProduct.dto';
import { CreateProductDTO } from './dto/createProduct.dto';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) { }

  async createProduct(productData: CreateProductDTO) {
    const productEntity = new ProductEntity();

    Object.assign(productEntity, productData as ProductEntity);

    return this.productRepository.save(productEntity);
  }

  async listProducts() {
    const productsSaved = await this.productRepository.find({
      relations: {
        images: true,
        details: true,
      },
    });
    const productsList = productsSaved.map(
      (product) =>
        new ListProductDTO(
          product.id,
          product.name,
          product.details,
          product.images,
        ),
    );
    return productsList;
  }

  async updateProduct(id: string, productData: UpdateProductDTO) {
    const product = await this.productRepository.findOneBy({ id });

    if (product === null) {
      throw new NotFoundException('Product not found');
    }

    Object.assign(product, productData as ProductEntity);

    return this.productRepository.save(product);
  }

  async removeProduct(id: string) {
    const product = await this.productRepository.delete(id);

    if (!product.affected) {
      throw new NotFoundException('Product not found');
    }
  }
}
