import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MyLoggerModule } from 'src/my-logger/my-logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),                               
    ConfigModule,                                                    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),             
        signOptions: { expiresIn: '60s' },                           
      }),
      inject: [ConfigService],
    }),
    MyLoggerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}