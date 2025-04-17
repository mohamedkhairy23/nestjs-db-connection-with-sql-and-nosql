import { Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './mongo/mongo.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
    }),
    UsersModule,
    MongoModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
