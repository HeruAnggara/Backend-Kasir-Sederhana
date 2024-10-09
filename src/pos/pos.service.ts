import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePoDto } from './dto/create-po.dto';
import { UpdatePoDto } from './dto/update-po.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponse } from 'helper/ApiResponse.interface';

@Injectable()
export class PosService {
  constructor(private prismaService: PrismaService) {}

  async orderInProgress() {
    const order = await this.prismaService.order.findFirst({
      where: {
        doneAt: null,
      }
    })

    return order;
  }


  async create(): Promise<any> {
    const order = await this.orderInProgress();
    if (order) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'There is an order in progress',
        data: order
      }
    }

    try {
      const newOrder = await this.prismaService.order.create({
        data: {
          invoiceNumber: this.generateInvoiceNumber(),
        },
      })

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Order created successfully',
      }
    } catch (error) {
      console.log(error);
      
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async findAll() {
    try {
      const data = await this.prismaService.order.findMany({
        where: {
          doneAt: {
            not: null
          }
        }
      })

      return {
        statusCode: HttpStatus.OK,
        message: 'Orders fetched successfully',
        data: data
      }
    } catch (error) {
      console.log(error);
      
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }

  async findOne(id: number) {
    try {
      
    } catch (error) {
      
    }
  }

  async update(productId: string, isAdded: boolean = true): Promise<ApiResponse> {
    const order = await this.orderInProgress();

    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const orderProduct = await this.prismaService.orderProduct.findFirst({
      where: {
        orderId: order.id,
        productId: product.id,
      },
    });

    if (orderProduct) {
      if (isAdded) {
        await this.prismaService.orderProduct.update({
          where: { id: orderProduct.id },
          data: { quantity: orderProduct.quantity + 1 },
        });
        
        return {
          statusCode: HttpStatus.OK,
          message: 'Product quantity updated successfully',
        };
      } else {
        const newQuantity = orderProduct.quantity - 1;
        if (newQuantity < 1) {
          await this.prismaService.orderProduct.delete({
            where: { id: orderProduct.id },
          });
          
          return {
            statusCode: HttpStatus.OK,
            message: 'Product quantity updated successfully',
          }
        } else {
          const newQuantity = orderProduct.quantity - 1;
          if (newQuantity < 1) {
            await this.prismaService.orderProduct.delete({
              where: { id: orderProduct.id },
            });
            return {
              statusCode: HttpStatus.OK,
              message: 'Product quantity updated successfully',
            }
          } else {
            await this.prismaService.orderProduct.update({
              where: { id: orderProduct.id },
              data: { quantity: newQuantity },
            });
            
            return {
              statusCode: HttpStatus.OK,
              message: 'Product quantity updated successfully',
            };

          }
        }
      }
    } else {
      if (isAdded) {
        await this.prismaService.orderProduct.create({
          data: {
            orderId: order.id,
            productId: product.id,
            unitPrice: product.sellPrice,
            quantity: 1,
          },
        });
        
        return {
          statusCode: HttpStatus.CREATED,
          message: 'Product added to order successfully',
        }
      }
    }

    return {
      statusCode: HttpStatus.OK,
      message: isAdded ? 'Product added to order successfully' : 'Product removed from order successfully',
    }
  }

  async remove(id: number) {
    try {
      
    } catch (error) {
      
    }
  }

  async done (updatePoDto: UpdatePoDto) {
    const order = await this.orderInProgress();

    try {
      order.paidAmount = updatePoDto.paidAmount
      order.doneAt = new Date();
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Order done successfully',
      }
    } catch (error) {
      console.log(error);
      
      throw new InternalServerErrorException('Failed to update order');
    }
  }

  generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const randomNumber = Math.floor(Math.random() * 1000000);

    return `INV-${year}-${month}-${day}-${randomNumber}`;
  }




}
