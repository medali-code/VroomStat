import { CustomRepository } from 'src/database/typeorm-ex.decorator'; 
import { Client } from '../../client/entities/client.entity';  
import { Repository } from 'typeorm';

@CustomRepository(Client)  
export class clientRepository extends Repository<Client> {
  
  }

