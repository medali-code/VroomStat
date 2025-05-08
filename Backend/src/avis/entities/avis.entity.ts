import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Client } from '../../client/entities/client.entity';
export enum AvisStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
@Entity()
export class Avis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  note: number;

  @Column()
  commentaire: string;


  @Column({
    type: 'enum',
    enum: AvisStatus,
    default: AvisStatus.PENDING,
  })
  statut: AvisStatus;
  @ManyToOne(() => Client, client => client.avis, { onDelete: 'CASCADE' })
  client: Client;
}
