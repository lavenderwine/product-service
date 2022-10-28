import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusCode } from '../common/constants/status-code.enum';
import { ProductNotFoundException } from '../common/exception';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

// TODO: Error handling
// TODO: Unit testing
@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private productRepositoty: Repository<Product>
  ) {

  }

  async create(createProductDto: CreateProductDto) {
    return this.productRepositoty.save(createProductDto);
  }

  async findAll() {
    return await this.productRepositoty.find();
  }

  async findOne(id: number) {
    const product = await this.productRepositoty.findOneBy({ id });

    if (!product) {
      throw new ProductNotFoundException();
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepositoty.findOneBy({ id });

    if (!product) {
      throw new ProductNotFoundException();
    }

    await this.productRepositoty.update({
      id
    }, {
      ...updateProductDto
    });
    return await this.productRepositoty.findOneBy({ id });
  }

  async remove(id: number) {
    const product = await this.productRepositoty.findOneBy({ id });

    if (!product) {
      throw new ProductNotFoundException();
    }

    await this.productRepositoty.softDelete({ id });
  }
}
