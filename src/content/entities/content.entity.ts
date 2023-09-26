import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  videoTitle: string;

  @Column()
  videoUrl: string;

  @Column()
  comment: string;

  @Column({ type: 'int' })
  rating: number;

  @Column()
  thumbnailUrl: string;

  @Column()
  creatorName: string;

  @Column()
  creatorUrl: string;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  postedBy: User;

  @Column({ default: true, select: false })
  published: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
