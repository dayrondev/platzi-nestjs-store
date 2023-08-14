import { Module, Global } from '@nestjs/common'

const API_KEY = '123456'
const API_KEY_PROD = 'a5s6d45as4d65a'

@Global()
@Module({
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY
    }
  ],
  exports: ['API_KEY']
})
export class DatabaseModule {}
