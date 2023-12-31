import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards
  // Res
  // ParseIntPipe,
} from '@nestjs/common'
// import { Response } from 'express'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
// import { AuthGuard } from '@nestjs/passport'

import { ParseIntPipe } from '../../common/parse-int.pipe'
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto
} from '../dtos/products.dtos'

import { ProductsService } from './../services/products.service'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { Public } from '../../auth/decorators/public.decorator'
import { Roles } from '../../auth/decorators/roles.decorator'
import { Role } from '../../auth/models/roles.model'

// @UseGuards(AuthGuard('jwt'))
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List of products' })
  getProducts(
    // @Query('limit') limit = 100,
    // @Query('offset') offset = 0,
    // @Query('brand') brand: string
    @Query() params: FilterProductsDto
  ) {
    // return {
    //   message: `products limit=> ${limit} offset=> ${offset} brand=> ${brand}`,
    // };
    return this.productsService.findAll(params)
  }

  @Get('filter')
  getProductFilter() {
    return `yo soy un filter`
  }

  @Get(':productId')
  @HttpCode(HttpStatus.ACCEPTED)
  getOne(@Param('productId', ParseIntPipe) productId: number) {
    // response.status(200).send({
    //   message: `product ${productId}`,
    // });
    return this.productsService.findOne(productId)
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.productsService.create(payload)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() payload: UpdateProductDto) {
    return this.productsService.update(id, payload)
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productsService.remove(id)
  }

  @Delete(':id/category/:categoryId')
  deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number
  ) {
    return this.productsService.removeCategoryByProduct(id, categoryId)
  }

  @Put(':id/category/:categoryId')
  addCategory(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number
  ) {
    return this.productsService.addCategoryByProduct(id, categoryId)
  }
}
