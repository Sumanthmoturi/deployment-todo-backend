import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todos/todos.module';
import { User } from './auth/user.entity';
import { Todo } from './todos/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'new_password',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      entities:[User,Todo],
    }),
    AuthModule,
    TodoModule,
  ],
})
export class AppModule {}
