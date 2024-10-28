import { Entity, Column, PrimaryGeneratedColumn,ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'varchar', length: 8, default: '00:00:00' }) // Format: HH:mm:ss
  time: string;

  @Column({ default: 'in-progress' })
  status: string;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}