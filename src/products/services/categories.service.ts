import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Category } from '../entities/category.entity'
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dtos'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}

  findAll() {
    return this.categoriesRepository.find()
  }

  async findOne(id: number) {
    const item = await this.categoriesRepository.findOne({ where: { id } })
    if (!item) {
      throw new NotFoundException(`Category #${id} not found`)
    }
    return item
  }

  create(data: CreateCategoryDto) {
    const item = this.categoriesRepository.create(data)
    return this.categoriesRepository.save(item)
  }

  async update(id: number, changes: UpdateCategoryDto) {
    const item = await this.categoriesRepository.findOne({ where: { id } })
    this.categoriesRepository.merge(item, changes)
    return this.categoriesRepository.save(item)
  }

  remove(id: number) {
    return this.categoriesRepository.delete(id)
  }
}
