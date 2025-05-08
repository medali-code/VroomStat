import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import figlet = require('figlet');
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import express = require('express');
import path = require('path');
import { TransformResponseInterceptor } from './shared/interceptors/transform-response.interceptor';
import { ExceptionsFilter } from './shared/filters/http-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { ServiceAccount } from 'firebase-admin';
import * as compression from 'compression';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix(process.env.API_PREFIX);
  /**
 * Security and optimization middlewares
 */
  app.use(cors());

  app.use(compression());


  /**
* Transform successful responses interceptor
*/
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  /**
 * Transform failure responses filter
 */
  app.useGlobalFilters(new ExceptionsFilter());

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('VROOMSTAT API')
      .setDescription('The VROOMSTAT API description')
      .setVersion('2.0')
      .addTag('VROOMSTAT')
      //.addServer(process.env.SWAGER_SERVER)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      ignoreGlobalPrefix: false,
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api-docs', app, document);
    /** Morgan Config */
    app.use(morgan('dev'));

    figlet('VROOMSTAT API', function (err, data) {
      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }
      console.log(data);
    });
  }
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  /** Serve static files */
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.use(
    '/public/test/',
    express.static(path.join(process.cwd(), 'public')),
  );

  const configService: ConfigService = app.get(ConfigService);
  const adminConfig: ServiceAccount = {
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    privateKey: configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      .replace(/\\n/g, '\n'),
    clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  await app.listen(3002);
}
bootstrap();