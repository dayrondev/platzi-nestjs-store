import {
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'

import { Customer } from './customer.entity'
import { OrderProduct } from './order-product.entity'

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date

  @ManyToOne(() => Customer, customer => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer

  @Exclude()
  @OneToMany(() => OrderProduct, item => item.order)
  products: OrderProduct[]

  @Expose()
  get items() {
    if (this.products) {
      return this.products
        .filter(item => !!item)
        .map(item => ({
          ...item.product,
          quantity: item.quantity,
          itemId: item.id
        }))
    }
    return []
  }

  @Expose()
  get total() {
    if (this.products) {
      return this.products
        .filter(item => !!item)
        .reduce((total, item) => {
          const totalItem = item.product.price * item.quantity
          return total + totalItem
        }, 0)
    }
    return null
  }
}
