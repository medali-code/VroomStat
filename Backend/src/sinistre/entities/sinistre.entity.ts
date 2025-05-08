import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from '../../client/entities/client.entity';
import { Vehicule } from '../../vehicule/entities/vehicule.entity';

export enum SinistreStatut {
  EN_ATTENTE = 'en attente',
  VALIDE     = 'validé',
  REFUSE     = 'refusé',
  CLOTURE  = 'clôturé',
}

export enum PieceType {
  CUSTODE_AVANT_DROITE  = 'Custode Avant droite',
  CUSTODE_AVANT_GAUCHE  = 'Custode Avant gauche',
  DEFLECTEUR_ARRIERE_DROITE = 'Déflecteur Arrière droite',
  DEFLECTEUR_ARRIERE_GAUCHE = 'Déflecteur Arrière gauche',
  LUNETTE_ARRIERE_DROITE = 'Lunette Arrière droite',
  LUNETTE_ARRIERE_GAUCHE = 'Lunette Arrière gauche',
  LUNETTE_ARRIERE      = 'Lunette Arrière',
  PARE_BRISE          = 'Pare-brise',
  VITRE_ARRIERE_DROITE  = 'Vitre Arrière droite',
  VITRE_ARRIERE_GAUCHE  = 'Vitre Arrière gauche',
  VITRE_AVANT_DROITE    = 'Vitre Avant droite',
  VITRE_AVANT_GAUCHE    = 'Vitre Avant gauche',
  VITRE_LATERALE_DROITE  = 'Vitre Latérale droite',
  VITRE_LATERALE_GAUCHE  = 'Vitre Latérale gauche',
}

@Entity()
export class Sinistre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  dateDeclaration: Date;

  @Column()
  lieu: string;

  @Column()
  commentaire: string;

  @Column({
    type: 'enum',
    enum: SinistreStatut,
    default: SinistreStatut.EN_ATTENTE,
  })
  statut: SinistreStatut;

  @Column()
  numeroAssurence: string;
  @Column()
  nomAdversaire: string;
  @Column()
  prenomAdversaire: string;
  @Column()
  numeroAssurenceAdversaire: string;
  @Column()
  matriculeAdvr: string;
  @Column()
  marqueVoitureAdvr: string;
  @Column()
  agenceAdvr: string;
  @Column()
  agenceClient: string;

  @Column({
    type: 'enum',
    enum: PieceType,
  })
  type: PieceType; // Consider if 'type' should be an array if multiple pieces are damaged? Your current data shows only one type. Let's stick to one primary type for now, and list others in 'commentaire'.

  @Column('simple-array', { nullable: true })
  images: string[]; // This is correct for storing filenames

  @ManyToOne(() => Client, client => client.sinistres, { onDelete: 'CASCADE' })
  client: Client;

  @ManyToOne(() => Vehicule, vehicule => vehicule.sinistres, { onDelete: 'CASCADE' })
  vehicule: Vehicule;
}