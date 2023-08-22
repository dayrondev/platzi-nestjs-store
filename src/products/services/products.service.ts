import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Between, FindOptionsWhere } from 'typeorm'

// import { BrandsService } from './brands.service'
import { Product } from './../entities/product.entity'
import { Category } from './../entities/category.entity'
import { Brand } from '../entities/brand.entity'
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto
} from './../dtos/products.dtos'

@Injectable()
export class ProductsService {
  constructor(
    // private brandsService: BrandsService,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>
  ) {}

  findAll(params?: FilterProductsDto) {
    if (params) {
      const where: FindOptionsWhere<Product> = {}
      const { limit, offset, maxPrice, minPrice } = params
      if (minPrice && maxPrice) {
        where.price = Between(minPrice, maxPrice)
      }
      return this.productRepo.find({
        where,
        relations: ['brand'],
        take: limit,
        skip: offset
      })
    }
    return this.productRepo.find({
      relations: ['brand']
    })
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['brand', 'categories']
    })
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`)
    }
    return product
  }

  async create(data: CreateProductDto) {
    /*const newProduct = new Product()
    newProduct.image = data.image
    newProduct.name = data.name
    newProduct.description = data.description
    newProduct.price = data.price
    newProduct.stock = data.stock*/

    const newProduct = this.productRepo.create(data)
    if (data.brandId) {
      const brand = await this.brandRepo.findOne({
        where: { id: data.brandId }
      })
      newProduct.brand = brand
    }
    if (data.categoryIds) {
      const categories = await this.categoryRepo.findBy({
        id: In(data.categoryIds)
      })
      newProduct.categories = categories
    }
    return this.productRepo.save(newProduct)
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.productRepo.findOne({ where: { id } })
    if (changes.brandId) {
      const brand = await this.brandRepo.findOne({
        where: { id: changes.brandId }
      })
      product.brand = brand
    }
    if (changes.categoryIds) {
      const categories = await this.categoryRepo.findBy({
        id: In(changes.categoryIds)
      })
      product.categories = categories
    }
    this.productRepo.merge(product, changes)
    return this.productRepo.save(product)
  }

  async removeCategoryByProduct(productId: number, categoryId: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['categories']
    })
    product.categories = product.categories.filter(i => i.id !== categoryId)
    return this.productRepo.save(product)
  }

  async addCategoryByProduct(productId: number, categoryId: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['categories']
    })
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId }
    })
    product.categories.push(category)
    return this.productRepo.save(product)
  }

  remove(id: number) {
    return this.productRepo.delete(id)
  }
}
