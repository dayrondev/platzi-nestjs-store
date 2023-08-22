import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { Exclude } from 'class-transformer'

import { Product } from '../../products/entities/product.entity'
import { Order } from './order.entity'

@Entity({ name: 'orders_products' })
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number

  @Exclude()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date

  @Exclude()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date

  @Column({ type: 'int' })
  quantity: number

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @ManyToOne(() => Order, order => order.products)
  @JoinColumn({ name: 'order_id' })
  order: Order
}
