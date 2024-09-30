import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

interface ApiResponse {
    statusCode: number;
    message: string;
}

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async getProducts(): Promise<any> {
    try {
      const data = await this.prismaService.product.findMany();

      return {
        statusCode: HttpStatus.OK,
        message: 'Products fetched successfully',
        data: data,
      };
    } catch (error) {
      throw InternalServerErrorException;
    }
  }

  async getProduct(id: string): Promise<any> {
    try {
      const data = await this.prismaService.product.findUnique({
        where: {
          id: id,
        },
      });

      if (!data) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found',
          data: null,
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Product fetched successfully',
        data: data,
      };
    } catch (error) {
      throw InternalServerErrorException;
    }
  }

  async createProduct(product: CreateProductDto): Promise<ApiResponse> {
    try {
      const data = await this.prismaService.product.create({
        data: {
          name: product.name,
          description: product.description,
          costPrice: product.costPrice,
          sellPrice: product.sellPrice,
          image: product.image,
          stock: product.stock,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product created successfully',
      };
    } catch (error) {
      throw InternalServerErrorException;
    }
  }

  async updateProduct(id: string, product: UpdateProductDto): Promise<ApiResponse> {
    const dataProduct = await this.getProduct(id);

    if (dataProduct.statusCode !== HttpStatus.OK) {
      return dataProduct;
    }

    try {
      const data = await this.prismaService.product.update({
        where: {
          id: id,
        },
        data: {
          name: product.name,
          description: product.description,
          costPrice: product.costPrice,
          sellPrice: product.sellPrice,
          image: product.image,
          stock: product.stock,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Product updated successfully',
      };
    } catch (error) {
      throw InternalServerErrorException;
    }
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    const dataProduct = await this.getProduct(id);

    if (dataProduct.statusCode !== HttpStatus.OK) {
      return dataProduct;
    }

    try {
      const data = await this.prismaService.product.update({
        where: {
          id: id,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      throw InternalServerErrorException;
    }
  }
}