import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsNotEmpty, IsEmail } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ unique: true })
  @IsNotEmpty({
    message: "mobile number is mandatory",
  })
  mobileNumber: string;

  @Column()
  @IsNotEmpty({
    message: "first name is mandatory",
  })
  firstName: string;

  @Column()
  @IsNotEmpty({
    message: "last name is mandatory",
  })
  lastName: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ unique: true })
  @IsNotEmpty({
    message: "email is mandatory",
  })
  @IsEmail()
  email: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
