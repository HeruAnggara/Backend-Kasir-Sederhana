import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UploadMiddleware } from 'src/upload/upload.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadMiddleware) // Mendaftarkan middleware
      .forRoutes(ProductController); // Terapkan middleware untuk rute di ProductController
  }
}
