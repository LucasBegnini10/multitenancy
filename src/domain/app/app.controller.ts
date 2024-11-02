import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/database-by-subdomain")
  async getDatabaseBySubdomain(@Headers('database') database: string) {
    return await this.appService.getDatabaseName(database);
  }


  @Post("create-database-by-tenant")
  async createDatabase(@Body() body: { subdomain: string, tenant: string }) {
    return await this.appService.createDatabase(body);
  }
}
