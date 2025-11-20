import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that are not in DTO
      forbidNonWhitelisted: true, // throws error if extra properties sent
    }),
  );
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Your Next.js frontend URL
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
