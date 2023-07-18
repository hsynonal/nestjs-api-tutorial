import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Cats example') //yöntemiyle başlık eklenir
    .setDescription('The cats API description') //yöntemiyle açıklama eklenir
    .setVersion('1.0') //yöntemiyle sürüm eklenir
    .addTag('cats') //yöntemiyle etiket (tag) eklenir.
    .build(); //build yöntemi çağrılarak yapılandırma tamamlanır ve config değişkenine atanır
  const document = SwaggerModule.createDocument(app, config); //SwaggerModule.createDocument yöntemi,
//NestJS uygulaması (app) ve yapılandırma (config) parametreleri ile çağrılarak Swagger belgesi oluşturulur. 
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3334);
}
bootstrap();
