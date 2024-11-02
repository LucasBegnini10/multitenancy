import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private dataSource: DataSource) {}

  async use(req: Request, res: Response, next: NextFunction) {
    //Obtem o subdomínio da requisição
    const subdomain = req.headers['x-subdomain'];

    // Busca um tenant com o subdomain
    const response = await this.dataSource.query(
      'SELECT * FROM tenants WHERE subdomain = $1',
      [subdomain],
    );

    if (Array.isArray(response) && response.length > 0) {
      const database = response[0].database_name;
      
      // Injeta o nome do banco de dados na requisição
      req.headers['database'] = database;
      next();
      return;
    }

    res.status(404).send('Tenant not found');
  }
}
