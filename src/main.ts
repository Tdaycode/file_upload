import { NestFactory } from '@nestjs/core';
import { FileUploadModule } from './fileupload.module';

async function bootstrap() {
  const app = await NestFactory.create(FileUploadModule);
  await app.listen(3000);
}
bootstrap();
