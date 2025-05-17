import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column('text', { array: true })
  defaultImageUrl: string[];

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Category, (category) => category.products, {
    eager: true,
  })
  category: Category;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
    eager: true,
  })
  variants: ProductVariant[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
