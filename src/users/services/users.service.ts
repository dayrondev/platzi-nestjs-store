import { Injectable, NotFoundException /*, Inject*/ } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
// import { Client } from 'pg'
import * as bcrypt from 'bcrypt'

import { User } from '../entities/user.entity'
//import { Order } from '../entities/order.entity'
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto'

// import { ProductsService } from '../../products/services/products.service'
import { CustomersService } from './customers.service'

@Injectable()
export class UsersService {
  constructor(
    // @Inject('PG') private clientPg: Client,
    // private productsService: ProductsService,
    private configService: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
    private customersService: CustomersService
  ) {}

  findAll() {
    const apiKey = this.configService.get('API_KEY')
    const dbName = this.configService.get('DATABASE_NAME')
    console.log(apiKey, dbName)

    return this.userRepo.find({
      relations: ['customer']
    })
  }

  async findOne(id: number) {
    const item = await this.userRepo.findOne({ where: { id } })
    if (!item) {
      throw new NotFoundException(`User #${id} not found`)
    }
    return item
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } })
  }

  async create(data: CreateUserDto) {
    const item = this.userRepo.create(data)
    const hashPassword = await bcrypt.hash(item.password, 10)
    item.password = hashPassword
    if (data.customerId) {
      const customer = await this.customersService.findOne(data.customerId)
      item.customer = customer
    }
    return this.userRepo.save(item)
  }

  async update(id: number, changes: UpdateUserDto) {
    const item = await this.userRepo.findOne({ where: { id } })
    this.userRepo.merge(item, changes)
    return this.userRepo.save(item)
  }

  remove(id: number) {
    return this.userRepo.delete(id)
  }

  /*async getOrdersByUser(id: number): Promise<Order> {
    const user = await this.findOne(id)
    const products = await this.productsService.findAll()
    return {
      id: Math.random(),
      date: new Date(),
      user,
      products: []
    }
  }*/

  /*getTasks() {
    return new Promise((resolve, reject) => {
      this.clientPg.query('select * from tasks', (err, res) => {
        if (err) reject(err)
        resolve(res.rows)
      })
    })
  }*/
}
