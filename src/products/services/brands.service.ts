import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Brand } from '../entities/brand.entity'
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos'

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private brandRepo: Repository<Brand>) {}

  findAll() {
    return this.brandRepo.find()
  }

  async findOne(id: number) {
    const item = await this.brandRepo.findOne({
      where: { id },
      relations: ['products']
    })
    if (!item) {
      throw new NotFoundException(`Brand #${id} not found`)
    }
    return item
  }

  create(data: CreateBrandDto) {
    const item = this.brandRepo.create(data)
    return this.brandRepo.save(item)
  }

  async update(id: number, changes: UpdateBrandDto) {
    const item = await this.brandRepo.findOne({ where: { id } })
    this.brandRepo.merge(item, changes)
    return this.brandRepo.save(item)
  }

  remove(id: number) {
    return this.brandRepo.delete(id)
  }
}
