import { IsNotEmpty, IsNumber, IsPositive } from "class-validator"

export class CreateProductDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number

    description: string

    imageUrl: string
}
