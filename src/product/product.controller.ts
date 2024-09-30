import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse } from 'helper/ApiResponse.interface';

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
    async createProduct(
        @Body() product: CreateProductDto
    ): Promise<ApiResponse> {
        return this.productService.createProduct(product);
    }

    @Put(':id')
    async updateProduct(
        @Param('id') id: string,
        @Body() product: UpdateProductDto
    ): Promise<ApiResponse> {
        return this.productService.updateProduct(id, product);
    }

    @Patch(':id')
    async deleteProduct(
        @Param('id') id: string
    ): Promise<ApiResponse> {
        return this.productService.deleteProduct(id);
    }

}
