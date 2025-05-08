import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Client } from '../../client/entities/client.entity';
import { Sinistre } from 'src/sinistre/entities/sinistre.entity';

@Entity()
export class Vehicule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  marque: string;

  @Column()
  modele: string;

  @Column({ unique: true })
  immatriculation: string;

  @Column()
  couleur: string;

  @Column()
  annee: number;

  @ManyToOne(() => Client, client => client.vehicules, { onDelete: 'CASCADE' })
  proprietaire: Client;

  @OneToMany(() => Sinistre, sinistre => sinistre.vehicule)
  sinistres: Sinistre[];
}
