import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST'),
        port: configService.get('PG_PORT'),
        username: configService.get('PG_USERNAME'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_DATABASE'),
        ssl: {
          rejectUnauthorized: false,
        },
        // or just: ssl: true, if you're not dealing with self-signed certs
        entities: [__dirname + '/../**/*.entity{.ts ,.js}'],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
