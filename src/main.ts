import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import  bodyParser from 'body-parser';
// import csurf from 'csurf'; // Remove or comment this line
import  cookieParser from 'cookie-parser';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use body parsers for large payloads
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Use cookie parser to manage cookies for CSRF (if you still need it for other reasons)
  app.use(cookieParser());

  // If you are not using CSRF tokens, just skip adding the csurf middleware
  // app.use(csurf()); // Remove or comment out this line

  // Enable CORS with frontend URL
  app.enableCors({
    origin: 'https://profilecardsfrontend.vercel.app', // Your frontend URL
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization', // No CSRF token headers needed
    credentials: true, // Allow cookies to be sent with requests
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
