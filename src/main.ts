import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as bodyParser from 'body-parser'; // Import the body-parser module

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase the payload size limit
  app.use(bodyParser.json({ limit: '50mb' })); // Set the limit to 50mb (or any size you need)
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Allow large form-data as well

  // Enable CORS with your frontend URL
  app.enableCors({
    origin: 'https://profilecardsfrontend.vercel.app', // Replace with your frontend URL
    methods: 'GET,POST,PUT,DELETE',  // Allowed methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
