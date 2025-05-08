import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';


@Injectable()
export class MemoryStoreService {

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {
  }

  public get(key: string): Promise<any> {
    return this.cache.get(key);
  }

  public set(key: string, value: any, options?: { ttl: number }): Promise<any> {
    return this.cache.set(key, value, 1000000);
  }

  public del(key: string): Promise<any> {
    return this.cache.del(key);
  }
}
