import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { CarYearsModule } from './car/car-years/car-years.module';
import { EngineCodesModule } from './engine/engine-codes/engine-codes.module';
import { CarSeriesModule } from './car/car-series/car-series.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SolutionsModule } from './engine/solutions/solutions.module';
import { ProblemsModule } from './engine/problems/problems.module';
import { SymptomsModule } from './engine/symptoms/symptoms.module';
import { RulesModule } from './engine/rules/rules.module';
import { ConsultationsModule } from './engine/consultations/consultations.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SuspensionModule } from './suspension/suspension.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        // dropSchema: true
      }),
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAILER_EMAIL,
          pass: process.env.MAILER_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <ekosusilo140604@gmail.com>',
      },
      template: {
        dir: join(__dirname, './mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
    CarSeriesModule,
    CarYearsModule,
    EngineCodesModule,
    SolutionsModule,
    ProblemsModule,
    SymptomsModule,
    RulesModule,
    ConsultationsModule,
    SuspensionModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }
