import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '..', 'public'), // For Production
      rootPath: join('public'),
      serveRoot: '/', 
    }),
    PrismaModule, 
    ProductModule],
})
export class AppModule {}
