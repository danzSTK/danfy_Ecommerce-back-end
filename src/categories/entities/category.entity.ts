import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
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
    if (this.name) {
      this.name = this.name.toLowerCase().trim();
    }
  }

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  // categoria pai
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
  })
  parent?: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];
}
