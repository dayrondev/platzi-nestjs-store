import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator'
//import { PartialType } from '@nestjs/mapped-types';
import { PartialType, ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'users email'
  })
  readonly email: string

  @IsString()
  @IsNotEmpty()
  @Length(6)
  readonly password: string

  @IsNotEmpty()
  readonly role: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
