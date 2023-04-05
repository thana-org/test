import { Content } from 'src/content/entities/content.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Index()
  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registeredAt: Date;

  @OneToMany(() => Content, (content) => content.id)
  contents: Content[];
}
