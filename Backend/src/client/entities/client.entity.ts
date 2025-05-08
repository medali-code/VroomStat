import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Vehicule } from '../../vehicule/entities/vehicule.entity';
import { Sinistre } from 'src/sinistre/entities/sinistre.entity';
import { Avis } from 'src/avis/entities/avis.entity';
import { Role } from 'src/shared/enums/Role.enum';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  motDePasse: string;

  @Column()
  adresse: string;

  @Column({ type: 'bigint' })
  telephone: number;

  @CreateDateColumn()
  dateInscription: Date;

  @Column({ nullable: true })
  photoProfil?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,    
  })
  role: Role;

  @OneToMany(() => Vehicule, v => v.proprietaire)
  vehicules: Vehicule[];

  @OneToMany(() => Sinistre, s => s.client)
  sinistres: Sinistre[];

  @OneToMany(() => Avis, a => a.client)
  avis: Avis[];
}
