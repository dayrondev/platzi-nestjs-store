import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Order } from '../entities/order.entity'
import { OrderProduct } from '../entities/order-product.entity'
import { Product } from '../../products/entities/product.entity'

import { CreateOrderProductDto } from '../dtos/order-product.dto'

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderProduct) private itemRepo: Repository<OrderProduct>,
    @InjectRepository(Product) private productRepo: Repository<Product>
  ) {}

  async create(data: CreateOrderProductDto) {
    const order = await this.orderRepo.findOne({ where: { id: data.orderId } })
    const product = await this.productRepo.findOne({
      where: { id: data.productId }
    })
    const item = new OrderProduct()
    item.order = order
    item.product = product
    item.quantity = data.quantity
    return this.itemRepo.save(item)
  }
}
