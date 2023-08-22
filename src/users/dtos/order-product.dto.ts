import { IsNotEmpty, IsPositive } from 'class-validator'
import { PartialType, ApiProperty } from '@nestjs/swagger'

export class CreateOrderProductDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly orderId: number

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly productId: number

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly quantity: number
}

export class UpdateOrderProductDto extends PartialType(CreateOrderProductDto) {}
