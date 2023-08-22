import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CustomerController } from './controllers/customers.controller'
import { CustomersService } from './services/customers.service'
import { Customer } from './entities/customer.entity'
import { UsersController } from './controllers/users.controller'
import { UsersService } from './services/users.service'
import { User } from './entities/user.entity'
import { ProductsModule } from '../products/products.module'
import { Order } from './entities/order.entity'
import { OrderProduct } from './entities/order-product.entity'
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { OrderProductController } from './controllers/order-product.controller';
import { OrderProductService } from './services/order-product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, User, Order, OrderProduct]),
    ProductsModule
  ],
  controllers: [CustomerController, UsersController, OrdersController, OrderProductController],
  providers: [CustomersService, UsersService, OrdersService, OrderProductService]
})
export class UsersModule {}
