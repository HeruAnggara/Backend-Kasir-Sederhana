import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    costPrice: number;

    @IsNumber()
    @IsNotEmpty()
    sellPrice: number;

    @IsNotEmpty()
    image: string;

    @IsNumber()
    @IsNotEmpty()
    stock: number;
}