import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { ProductNotFoundException } from '../common/exception';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {

  }

  async create(createProductDto: CreateProductDto) {
    return this.productRepository.save(createProductDto);
  }

  async find(params?: FindManyOptions<Product>) {
    return await this.productRepository.find(params);
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new ProductNotFoundException();
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new ProductNotFoundException();
    }

    await this.productRepository.update({
      id
    }, {
      ...updateProductDto
    });
    return await this.productRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new ProductNotFoundException();
    }

    await this.productRepository.softDelete({ id });
  }
}
