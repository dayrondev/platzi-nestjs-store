import { Injectable, Inject } from '@nestjs/common'
import { /*ConfigService*/ ConfigType } from '@nestjs/config'
import config from 'config'

@Injectable()
export class AppService {
  constructor(
    //@Inject('API_KEY') private apiKey: string,
    @Inject('TASKS') private tasks: any[],
    //private config: ConfigService
    @Inject(config.KEY) private configService: ConfigType<typeof config>
  ) {}

  getHello(): string {
    //console.log(this.tasks)
    //return `Hello World! ${this.apiKey}`

    //const apiKey = this.config.get<string>('API_KEY')
    // const name = this.config.get('DATABASE_NAME')

    const apiKey = this.configService.apiKey
    const name = this.configService.database.name
    return `Hello World! ${apiKey} ${name}`
  }
}
