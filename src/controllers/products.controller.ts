import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put
  // Query,
  // Res,
  //ParseIntPipe,
} from '@nestjs/common'
//import { Response } from 'express';
import { ProductsService } from 'src/services/products.service'
import { ParseIntPipe } from '../common/parse-int/parse-int.pipe'
import { CreateProductDto, UpdateProductDto } from '../dtos/products.dtos'

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  getProducts /* @Query('limit') limit: number = 100,
    @Query('offset') offset: number = 0,
    @Query('brand') brand: string, */() {
    return this.productService.findAll()
  }

  @Get('filter')
  getProductFilter() {
    return `this is a filter`
  }

  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  //getProduct(@Param() params: any) {
  //getOne(@Res() response: Response, @Param('id') productId: string) {
  getOne(@Param('id', ParseIntPipe) productId: number) {
    /*return response.status(200).send({
      message: `product ${productId}`,
    });*/
    return this.productService.findOne(productId)
  }

  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.productService.create(payload)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() payload: UpdateProductDto) {
    return this.productService.update(+id, payload)
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productService.delete(+id)
  }
}
