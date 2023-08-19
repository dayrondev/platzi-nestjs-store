import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Customer } from '../entities/customer.entity'
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto'

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private customersRepo: Repository<Customer>
  ) {}

  findAll() {
    return this.customersRepo.find()
  }

  async findOne(id: number) {
    const item = await this.customersRepo.findOne({ where: { id } })
    if (!item) {
      throw new NotFoundException(`Customer #${id} not found`)
    }
    return item
  }

  create(data: CreateCustomerDto) {
    const item = this.customersRepo.create(data)
    return this.customersRepo.save(item)
  }

  async update(id: number, changes: UpdateCustomerDto) {
    const item = await this.customersRepo.findOne({ where: { id } })
    this.customersRepo.merge(item, changes)
    return this.customersRepo.save(item)
  }

  remove(id: number) {
    return this.customersRepo.delete(id)
  }
}
