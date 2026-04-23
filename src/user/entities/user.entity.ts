import { Todo } from "@/todo/entities/todo.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";


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
  @Column()
  password!: string;
  @Column()
  role!: string;
  @CreateDateColumn()
  createdAt!: Date;

  // one user can have multiple todos
  @OneToMany(() => Todo, (todo) => todo.user)
  todos!: Todo[]
}
