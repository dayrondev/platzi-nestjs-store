import { Module, Global } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Client } from 'pg'
import { TypeOrmModule } from '@nestjs/typeorm'

import config from '../../config'

const API_KEY = '123456'
const API_KEY_PROD = 'a5s6d45as4d65a'

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { host, port, user, password, database } = configService.postgres
        return {
          type: 'postgres',
          host,
          port,
          username: user,
          password,
          database,
          synchronize: false,
          autoLoadEntities: true
        }
      }
    })
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY
    },
    {
      provide: 'PG',
      useFactory: (configService: ConfigType<typeof config>) => {
        const { host, port, user, password, database } = configService.postgres
        const client = new Client({ host, port, user, password, database })
        client.connect()
        return client
      },
      inject: [config.KEY]
    }
  ],
  exports: ['API_KEY', 'PG', TypeOrmModule]
})
export class DatabaseModule {}
