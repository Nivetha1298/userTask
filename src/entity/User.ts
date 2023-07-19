
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { User as IUser } from '../interfaces/User'

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email?: string;
}
