import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Partner } from './entities/partner.entity';
import { Payment } from './entities/payment.entity';
import { WebhookEvent } from './entities/webhook-event.entity';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: (process.env.PAYMENT_DB_HOST || process.env.DB_HOST || 'localhost').trim(),
    port: parseInt((process.env.PAYMENT_DB_PORT || process.env.DB_PORT || '5432').trim(), 10),
    username: (process.env.PAYMENT_DB_USER || process.env.DB_USER || 'postgres').trim(),
    password: (process.env.PAYMENT_DB_PASS || process.env.DB_PASS || 'postgres').trim(),
    database: (process.env.PAYMENT_DB_NAME || process.env.DB_NAME || 'postgres').trim(),
    synchronize: false,
    logging: true,
    entities: [Partner, Payment, WebhookEvent],
    migrations: ['./src/migrations/*.ts'],
    ssl: process.env.PAYMENT_DB_SSL === 'true' || process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false,
    } : false,
});
