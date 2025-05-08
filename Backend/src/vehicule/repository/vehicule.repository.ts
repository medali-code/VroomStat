import { CustomRepository } from 'src/database/typeorm-ex.decorator'; 
import { Vehicule } from '../../vehicule/entities/vehicule.entity';  
import { Repository } from 'typeorm';

@CustomRepository(Vehicule)  
export class vehiculeRepository extends Repository<Vehicule> {
  
  }

