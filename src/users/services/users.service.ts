import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { Client } from 'pg'

import { User } from '../entities/user.entity'
import { Order } from '../entities/order.entity'
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto'

import { ProductsService } from '../../products/services/products.service'

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    @Inject('PG') private clientPg: Client,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private productsService: ProductsService
  ) {}

  findAll() {
    const apiKey = this.configService.get('API_KEY')
    const dbName = this.configService.get('DATABASE_NAME')
    console.log(apiKey, dbName)

    return this.usersRepository.find()
  }

  async findOne(id: number) {
    const item = await this.usersRepository.findOne({ where: { id } })
    if (!item) {
      throw new NotFoundException(`User #${id} not found`)
    }
    return item
  }

  create(data: CreateUserDto) {
    const item = this.usersRepository.create(data)
    return this.usersRepository.save(item)
  }

  async update(id: number, changes: UpdateUserDto) {
    const item = await this.usersRepository.findOne({ where: { id } })
    this.usersRepository.merge(item, changes)
    return this.usersRepository.save(item)
  }

  remove(id: number) {
    return this.usersRepository.delete(id)
  }

  async getOrdersByUser(id: number): Promise<Order> {
    const user = await this.findOne(id)
    const products = await this.productsService.findAll()
    return {
      date: new Date(),
      user,
      products
    }
  }

  getTasks() {
    return new Promise((resolve, reject) => {
      this.clientPg.query('select * from tasks', (err, res) => {
        if (err) reject(err)
        resolve(res.rows)
      })
    })
  }
}
