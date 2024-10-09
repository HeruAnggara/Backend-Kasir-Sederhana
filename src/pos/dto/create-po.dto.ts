import { IsNotEmpty, IsString } from "class-validator";

export class CreatePoDto {
    @IsNotEmpty()
    @IsString()
    invoiceNumber: string
}
