import { Todo } from '../../todo/entities/todo.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Constants } from '../../utils/constants';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  firstName!: string;
  @Column()
  lastName!: string;
  @Column({ unique: true })
  email!: string;
  @Column({ select: false })
  password!: string;
  @Column({ default: Constants.ROLE.NORMAL_ROLE })
  role!: string;
  @CreateDateColumn()
  createdAt!: Date;

  // one user can have multiple todos
  @OneToMany(() => Todo, (todo) => todo.user)
  todos!: Todo[];
}
