import { Role, Status } from 'src/common/interfaces/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({
    unique: true,
    length: 255,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value: string) => value,
    },
  })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ enum: Role, default: Role.USER, type: 'enum' })
  role: Role;

  @Column({ enum: Status, default: Status.ACTIVE, type: 'enum' })
  status: Status;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
