import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockType, repositoryMockFactory } from '../../test/utils/mock-factory';
import { ProductNotFoundException } from '../common/exception';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let productService: ProductsService;
  let mockedProductRepository: MockType<Repository<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useFactory: repositoryMockFactory },
      ],
    }).compile();

    productService = module.get<ProductsService>(ProductsService);
    mockedProductRepository = module.get(getRepositoryToken(Product));
  });

  describe('Create', () => {
    it('should successfully create product', async () => {
      //given
      const request: CreateProductDto = {
        name: 'Test',
        price: 123,
        description: 'test desc',
        imageUrl: 'http://test.com/test.png'
      }

      const expected: Product = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...request
      };

      mockedProductRepository.save.mockReturnValue(expected);

      // when
      expect(await productService.create(request)).toEqual(expected);

      // then
      expect(mockedProductRepository.save).toHaveBeenCalled();
    });
  })

  describe('FindAll', () => {
    it('should successfully get all products', async () => {
      //given
      const expected: Product[] = getSampleProducts();

      mockedProductRepository.find.mockReturnValue(expected);

      // when
      expect(await productService.findAll()).toEqual(expected);

      // then
      expect(mockedProductRepository.find).toHaveBeenCalled();
    });
  })

  describe('FindOne', () => {
    it('should successfully get product info', async () => {
      //given
      const id = 1;
      const expected: Product = {
        id,
        name: 'Test1',
        description: 'testproduct',
        price: 1,
        imageUrl: 'http://test.com/test.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };

      mockedProductRepository.findOneBy.mockReturnValue(expected);

      // when
      expect(await productService.findOne(id)).toEqual(expected);

      // then
      expect(mockedProductRepository.findOneBy).toHaveBeenCalledWith({ id });
    });

    it('should throw exception if product is not found', async () => {
      const id = 1;
      mockedProductRepository.findOneBy.mockReturnValue(null);

      // when
      await expect(productService.findOne(id)).rejects.toThrowError(ProductNotFoundException);

      // then
      expect(mockedProductRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });


  describe('Update', () => {
    it('should successfully update product info', async () => {
      //given
      const id = 1;
      const request: UpdateProductDto = {
        name: 'Test',
        price: 123,
      }

      const expected: Product = {
        id,
        name: request.name,
        description: 'testproduct',
        price: request.price,
        imageUrl: 'http://test.com/test.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };

      mockedProductRepository.findOneBy.mockReturnValue(expected);
      mockedProductRepository.update.mockReturnValue(expected);

      // when
      expect(await productService.update(id, request)).toEqual(expected);

      // then
      expect(mockedProductRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(mockedProductRepository.update).toHaveBeenCalledWith({ id }, { ...request });
    });

    it('should throw exception if product is not found', async () => {
      const id = 1;
      mockedProductRepository.findOneBy.mockReturnValue(null);

      // when
      await expect(productService.findOne(id)).rejects.toThrowError(ProductNotFoundException);

      // then
      expect(mockedProductRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });


  describe('Delete', () => {
    it('should successfully delete a product', async () => {
      //given
      const id = 1;

      const expected: Product = {
        id,
        name: 'Test1',
        description: 'testproduct',
        price: 123,
        imageUrl: 'http://test.com/test.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };

      mockedProductRepository.findOneBy.mockReturnValue(expected);
      // mockedProductRepository.softDelete.moc;

      // when
      expect(await productService.remove(id)).toBe(void true);

      // then
      expect(mockedProductRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(mockedProductRepository.softDelete).toHaveBeenCalledWith({ id });
    });

    it('should throw exception if product is not found', async () => {
      const id = 1;
      mockedProductRepository.findOneBy.mockReturnValue(null);

      // when
      await expect(productService.findOne(id)).rejects.toThrowError(ProductNotFoundException);

      // then
      expect(mockedProductRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

});

// putting here for now so the code block is focused on the implementation flow instead of data
function getSampleProducts(): Product[] {
  return [
    {
      id: 1,
      name: 'Test1',
      description: 'testproduct',
      price: 1,
      imageUrl: 'http://test.com/test.png',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    },
    {
      id: 2,
      name: 'Test2',
      description: 'testproduct2',
      price: 1,
      imageUrl: 'http://test.com/test.png',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    },
  ];
}

