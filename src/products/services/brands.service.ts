import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Brand } from '../entities/brand.entity'
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos'

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private brandsRepository: Repository<Brand>
  ) {}

  findAll() {
    return this.brandsRepository.find()
  }

  async findOne(id: number) {
    const item = await this.brandsRepository.findOne({ where: { id } })
    if (!item) {
      throw new NotFoundException(`Brand #${id} not found`)
    }
    return item
  }

  create(data: CreateBrandDto) {
    const item = this.brandsRepository.create(data)
    return this.brandsRepository.save(item)
  }

  async update(id: number, changes: UpdateBrandDto) {
    const item = await this.brandsRepository.findOne({ where: { id } })
    this.brandsRepository.merge(item, changes)
    return this.brandsRepository.save(item)
  }

  remove(id: number) {
    return this.brandsRepository.delete(id)
  }
}
