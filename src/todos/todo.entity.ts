import { Entity, Column, PrimaryGeneratedColumn,JoinColumn,ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({type:"int", default:0})
  time: number

  @Column({
    type: 'enum',
    enum: ['In progress', 'Completed'],
    default: 'In progress', 
  })
  status: 'In progress' | 'Completed';

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({ name: 'userId' })
  user: User;

}