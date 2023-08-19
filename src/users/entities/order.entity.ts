import { Column, Entity } from 'typeorm'
import { Product } from 'src/products/entities/product.entity'
import { User } from './user.entity'

@Entity()
export class Order {
  @Column({ type: 'date' })
  date: Date

  @Column({ type: 'int' })
  user: User

  @Column({ type: 'int' })
  products: Product[]
}
