import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Category } from '../entities/category.entity'
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dtos'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>
  ) {}

  findAll() {
    return this.categoryRepo.find()
  }

  async findOne(id: number) {
    const item = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products']
    })
    if (!item) {
      throw new NotFoundException(`Category #${id} not found`)
    }
    return item
  }

  create(data: CreateCategoryDto) {
    const item = this.categoryRepo.create(data)
    return this.categoryRepo.save(item)
  }

  async update(id: number, changes: UpdateCategoryDto) {
    const item = await this.categoryRepo.findOne({ where: { id } })
    this.categoryRepo.merge(item, changes)
    return this.categoryRepo.save(item)
  }

  remove(id: number) {
    return this.categoryRepo.delete(id)
  }
}
