import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  street: string;
}
