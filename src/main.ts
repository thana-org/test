import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('LearnHub API')
    .setDescription(
      'LearnHub is a demo API service for React Sharing Session 2022 by Thinc.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('user')
    .addTag('content')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
