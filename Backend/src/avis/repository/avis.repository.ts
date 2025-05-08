import { CustomRepository } from 'src/database/typeorm-ex.decorator'; 
import { Avis} from '../entities/avis.entity';  
import { Repository } from 'typeorm';

@CustomRepository(Avis)  
export class AvisRepository extends Repository <Avis> {
  
  }

