import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AppExceptionFilter, FieldValidationsException } from './common/exception';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true
    })
  );
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      transform: true,
      validationError: {
        target: false,
      },
      exceptionFactory: (errors) => new FieldValidationsException(errors)
    })
  );

  app.useGlobalFilters(new AppExceptionFilter(httpAdapterHost));

  await app.listen(process.env.PORT);
}
bootstrap();
