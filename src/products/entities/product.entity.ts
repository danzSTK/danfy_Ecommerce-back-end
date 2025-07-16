import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { ProductVariant } from 'src/variants/entities/variant.entity';

@Index('index_create_at', ['createAt'])
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

  @Column({ default: '' })
  imagePublicId: string;

  @Column()
  defaultImageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Category, (categories) => categories.products, {
    //eager: true,
  })
  @JoinTable()
  categories: Category[];

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
