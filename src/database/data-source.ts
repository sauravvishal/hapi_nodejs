import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../config';
import { User, UserMeta } from './entities';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DATABASE,
    synchronize: true,
    logging: ['error'],
    entities: [User, UserMeta],
});
