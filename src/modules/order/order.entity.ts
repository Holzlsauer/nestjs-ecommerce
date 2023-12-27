import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { StatusOrder } from './enum/statusOrder.enum';
import { ItemOrderEntity } from './itemOrder.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'total_price', nullable: false })
  totalPrice: number;

  @Column({ name: 'status', enum: StatusOrder, nullable: false })
  status: StatusOrder;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @OneToMany(() => ItemOrderEntity, (itemOrder) => itemOrder.order, {
    cascade: true,
  })
  itensOrder: ItemOrderEntity[];
}
