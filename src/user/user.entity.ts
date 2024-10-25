import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Todo } from '../todos/todo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  mobile: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column('simple-array', { default: '' })
  hobbies: string[];

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
