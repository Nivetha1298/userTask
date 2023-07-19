// src/entity/Form.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import{Form as IForm} from '../interfaces/Form'
@Entity()
export class Form implements IForm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  message: string;

  @Column()
  photo: string; 
}
