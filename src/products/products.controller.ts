import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ApiResponseDto } from '../common/dto';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<ApiResponseDto<Product>> {
    return {
      data: await this.productsService.create(createProductDto)
    };
  }

  @Get()
  async findAll(): Promise<ApiResponseDto<Product[]>> {
    return {
      data: await this.productsService.findAll()
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponseDto<Product>> {
    return {
      data: await this.productsService.findOne(id)
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<ApiResponseDto<Product>> {
    return {
      data: await this.productsService.update(id, updateProductDto)
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ApiResponseDto<[]>> {
    await this.productsService.remove(id);
    return {
      message: 'Product successfully deleted.',
      data: []
    }
  }
}
