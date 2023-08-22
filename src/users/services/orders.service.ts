import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Order } from '../entities/order.entity'
import { Customer } from '../entities/customer.entity'
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>
  ) {}

  findAll() {
    return this.orderRepo.find()
  }

  async findOne(id: number) {
    const item = await this.orderRepo.findOne({
      where: { id },
      relations: ['products', 'products.product']
    })
    if (!item) {
      throw new NotFoundException(`Order #${id} not found`)
    }
    return item
  }

  async create(data: CreateOrderDto) {
    const item = new Order()
    if (data.customerId) {
      const customer = await this.customerRepo.findOne({
        where: { id: data.customerId }
      })
      item.customer = customer
    }
    return this.orderRepo.save(item)
  }

  async update(id: number, changes: UpdateOrderDto) {
    const item = await this.orderRepo.findOne({ where: { id } })
    if (changes.customerId) {
      const customer = await this.customerRepo.findOne({
        where: { id: changes.customerId }
      })
      item.customer = customer
    }
    return this.orderRepo.save(item)
  }

  remove(id: number) {
    return this.orderRepo.delete(id)
  }
}
