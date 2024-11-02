import { DataSource } from 'typeorm';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class DatabaseProvider {
  private connections = new Map<string, DataSource>(); // Cache de conexões

  getConnection(databaseName: string): DataSource | undefined {
    if (this.connections.has(databaseName)) {
      return this.connections.get(databaseName);
    }

    const connection = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: databaseName,
      entities: [],
      synchronize: true,
    });

    this.connections.set(databaseName, connection);
    return connection;
  }

  getDatabaseNameForTenant(tenant: string): string {
    return `db_${tenant}`;
  }
}
