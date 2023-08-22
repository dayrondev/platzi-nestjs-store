import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Customer } from '../entities/customer.entity'
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto'

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private customerRepo: Repository<Customer>
  ) {}

  findAll() {
    return this.customerRepo.find()
  }

  async findOne(id: number) {
    const item = await this.customerRepo.findOne({ where: { id } })
    if (!item) {
      throw new NotFoundException(`Customer #${id} not found`)
    }
    return item
  }

  create(data: CreateCustomerDto) {
    const item = this.customerRepo.create(data)
    return this.customerRepo.save(item)
  }

  async update(id: number, changes: UpdateCustomerDto) {
    const item = await this.customerRepo.findOne({ where: { id } })
    this.customerRepo.merge(item, changes)
    return this.customerRepo.save(item)
  }

  remove(id: number) {
    return this.customerRepo.delete(id)
  }
}
