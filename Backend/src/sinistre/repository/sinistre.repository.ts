import { CustomRepository } from 'src/database/typeorm-ex.decorator'; 
import { Sinistre  } from '../../sinistre/entities/sinistre.entity';  
import { Repository } from 'typeorm';

@CustomRepository(Sinistre )  
export class SinistreRepository extends Repository<Sinistre > {
  
  }

