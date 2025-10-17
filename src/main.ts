import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RolesGuard } from './auth/roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  // Configure global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configure global guards
  const reflector = app.get(Reflector);
  app.useGlobalGuards(app.get(AuthGuard), new RolesGuard(reflector));

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server started on port ==> ${process.env.PORT ?? 3000}`);
  });
}
bootstrap();
