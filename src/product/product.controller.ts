import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse } from 'helper/ApiResponse.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get()
    async getProducts() {
        return this.productService.getProducts();
    }

    @Get(':id')
    async getProduct(
        @Param('id') id: string
    ) {
        return this.productService.getProduct(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createProduct(
        @Body() product: CreateProductDto,
        @UploadedFile() image: Express.Multer.File
    ): Promise<ApiResponse> {
        product.image = image.filename;

        try {
            return await this.productService.createProduct(product);
        } catch (error) {
            const filePath = path.join(__dirname, '..', 'public/products', image.filename);
            fs.unlink(filePath, (err) => {
                if (err) {
                console.error('Error deleting file:', err);
                }
            });

            throw new BadRequestException('Failed to create product');
        }
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('image'))
    async updateProduct(
      @Param('id') id: string,
      @Body() product: UpdateProductDto,
      @UploadedFile() image: Express.Multer.File
    ): Promise<ApiResponse> {
      if (image) {
        product.image = image.filename;
      }
  
      return this.productService.updateProduct(id, product);
    }

    @Patch(':id')
    async deleteProduct(
        @Param('id') id: string
    ): Promise<ApiResponse> {
        return this.productService.deleteProduct(id);
    }

}
