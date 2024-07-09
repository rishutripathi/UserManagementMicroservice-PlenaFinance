import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string): Promise<string> {
    console.log("key in service function", key);
    
    const cacheResponse = await this.cacheManager.get(key);
    return JSON.stringify(cacheResponse);
  }

  async set(key: string, value: string | object): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(key: string): Promise<void> {
    await this.cacheManager.reset();
  }
}