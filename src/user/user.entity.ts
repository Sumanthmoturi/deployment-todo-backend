import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Todo } from '../todos/todo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })  // Ensure name cannot be null
  name: string;

  @Column({ unique: true, nullable: false })  // Mobile must be unique
  mobile: string;

  @Column({ unique: true, nullable: false })  // Email must be unique
  email: string;
  
  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })  // Store hobbies as an array
hobbies: string[];

  @Column({ nullable: false })  // Password is required
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
