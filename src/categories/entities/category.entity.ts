import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName() {
    this.name = this.name.toLowerCase().trim();
  }

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
