import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from 'src/provider/database.provider';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    private readonly dbProvider: DatabaseProvider,
    private readonly dataSource: DataSource,
  ) {}

  async getDatabaseName(databaseName: string) {
    const connection = this.dbProvider.getConnection(databaseName);
    await connection.initialize();

    const currentDatabase = await connection.query('SELECT current_database()');

    await connection.destroy();

    return currentDatabase[0];
  }

  async createDatabase(body: { subdomain: string; tenant: string }) {
    const dataBaseName = this.dbProvider.getDatabaseNameForTenant(body.tenant);

    // Cria banco para tenant
    await this.dataSource.query(`CREATE DATABASE ${dataBaseName}`);

    // Insere mapeamento de subdomínio e tenant
    await this.dataSource.query(
      'INSERT INTO tenants (subdomain, database_name) VALUES ($1, $2)',
      [body.subdomain, dataBaseName],
    );

    return this.getDatabaseName(dataBaseName);
  }
}
