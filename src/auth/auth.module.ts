import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MyLoggerModule } from 'src/my-logger/my-logger.module';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
    UserModule,
    TypeOrmModule.forFeature([User]),                                                                                  
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),             
        signOptions: { expiresIn: '15m' },                           
      }),
      inject: [ConfigService],
    }),
    MyLoggerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports:[AuthService],
})
export class AuthModule {}