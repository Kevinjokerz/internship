import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config()


export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST || 'db',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'Zlzlz1z1zlz1!!!',
    database: process.env.MYSQL_DATABASE || 'mydatabase',
    port: Number(process.env.MYSQL_PORT) || 3306,
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true',
    entities: ['src/entities/*.ts'],
    subscribers: [],
    migrations: ['src/migrations/*.ts'],
    // migrationsTableName: "custom_migration_table",
})