import { ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppExceptionFilter } from '../src/common/exception/app-exception.filter';
import { FieldValidationsException } from '../src/common/exception/field-validations.exception';
import { Product } from '../src/products/entities/product.entity';
import { ProductsModule } from '../src/products/products.module';
import { apiErrorResponseData } from './utils/test-utils';


describe('ProductsController (e2e)', () => {
  let app: NestFastifyApplication;
  let repository: Repository<Product>;
  let productId;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return {
              type: 'mysql',
              host: configService.get('DB_HOST'),
              port: +configService.get<number>('DB_PORT'),
              username: configService.get('DB_USERNAME'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_NAME'),
              autoLoadEntities: true,
            }
          },
          inject: [ConfigService],
        }),
        ProductsModule
      ]
    })
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        forbidUnknownValues: true,
        transform: true,
        validationError: {
          target: false,
        },
        exceptionFactory: (errors) => new FieldValidationsException(errors)
      })
    )

    app.useGlobalFilters(new AppExceptionFilter(app.get(HttpAdapterHost)));

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    repository = moduleRef.get('ProductRepository');
  });

  describe('Create Products', () => {
    it('should throw error 400 when required fields are not present', () => {
      return app
        .inject({
          method: 'POST',
          url: '/products',
          payload: '{}',
          headers: {
            'content-type': 'application/json'
          }
        })
        .then((result) => {
          expect(result.statusCode).toEqual(400);
          expect(result.payload).toEqual(JSON.stringify(apiErrorResponseData));
        });
    });

    it('should create products when all fields are valid', async () => {
      const request = {
        name: "Test",
        price: 123,
        description: "Organic Shampoo",
        imageUrl: "http://192.168.31.129:3001/soap.jpg"
      };
      const expected = {
        data: {
          ...request
        }
      }

      return app
        .inject({
          method: 'POST',
          url: '/products',
          payload: JSON.stringify(request),
          headers: {
            'content-type': 'application/json'
          }
        })
        .then((result) => {
          expect(result.statusCode).toEqual(201);
          const actual = JSON.parse(result.payload);
          productId = actual.data.id;
          expect(actual).toMatchObject(expected);
        });
    });
  });

  describe('Get Products', () => {
    it('should throw error 404 when product is not found', () => {
      return app
        .inject({
          method: 'GET',
          url: `/products/999`,
          headers: {
            'content-type': 'application/json'
          }
        })
        .then((result) => {
          expect(result.statusCode).toEqual(404);
        });
    });

    it('should get product when id is found', async () => {
      const expected = {
        data: {
          name: "Test",
          price: "123",
          description: "Organic Shampoo",
          imageUrl: "http://192.168.31.129:3001/soap.jpg"
        }
      };

      return app
        .inject({
          method: 'GET',
          url: `/products/${productId}`,
          headers: {
            'content-type': 'application/json'
          }
        })
        .then((result) => {
          expect(result.statusCode).toEqual(200);
          expect(JSON.parse(result.payload)).toMatchObject(expected);
        });
    });
  });

  describe('Get All Products', () => {
    it('should return all products', async () => {
      const expected = {
        data: {
          name: "Test",
          price: "123",
          description: "Organic Shampoo",
          imageUrl: "http://192.168.31.129:3001/soap.jpg"
        }
      };

      return app
        .inject({
          method: 'GET',
          url: `/products`,
          headers: {
            'content-type': 'application/json'
          }
        })
        .then((result) => {
          expect(result.statusCode).toEqual(200);
          expect(JSON.parse(result.payload).data.length).toBeGreaterThan(0);
        });
    });
  });

  describe('Update Products', () => {
    const request = {
      name: "TestUpdated",
    };

    it('should throw error 404 when product is not found', () => {
      return app
        .inject({
          method: 'PUT',
          url: `/products/999`,
          headers: {
            'content-type': 'application/json'
          },
          payload: JSON.stringify(request)
        })
        .then((result) => {
          expect(result.statusCode).toEqual(404);
        });
    });

    it('should update product', async () => {
      const expected = { data: { ...request } };

      return app
        .inject({
          method: 'PUT',
          url: `/products/${productId}`,
          headers: {
            'content-type': 'application/json'
          },
          payload: JSON.stringify(request)
        })
        .then((result) => {
          expect(result.statusCode).toEqual(200);
          expect(JSON.parse(result.payload)).toMatchObject(expected);
        });
    });
  });


  describe('Delete Products', () => {
    it('should throw error 404 when product is not found', () => {
      return app
        .inject({
          method: 'DELETE',
          url: `/products/999`,
          headers: {
            'content-type': 'application/json'
          }
        })
        .then((result) => {
          expect(result.statusCode).toEqual(404);
        });
    });

    it('should delete product', async () => {
      return app
        .inject({
          method: 'DELETE',
          url: `/products/${productId}`,
          headers: {
            'content-type': 'application/json'
          }
        })
        .then((result) => {
          expect(result.statusCode).toEqual(200);
        });
    });
  });

  afterAll(async () => {
    // make sure we deleted added test record to our production DB
    await repository.query(`DELETE FROM products where id=${productId}`);
    await app.close();
  });
});
