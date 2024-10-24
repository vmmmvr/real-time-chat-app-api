import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './lib/interceptors/response.interceptor';
import { HttpExceptionFilter } from './lib/filters/http-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000; // Use PORT from .env or fallback to 3000
  // Apply the response interceptor globally
  app.useGlobalInterceptors(new ResponseInterceptor());

  console.log(configService.get<string>('DATABASE_URL'));

  // Apply the global error handler
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('ChatIO')
    .setDescription('ChatIO API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken', // Define the name of the bearerAuth scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Enable CORS globally
  app.enableCors();
  await app.listen(port);
  console.log(`Application running on port ${port}`);
}
bootstrap();
