import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';

@Injectable()
export class AdminService {
  constructor(private readonly storeService: StoreService) {}

  async findAll(query: string, curent: number, pageSize: number) {
    return await this.storeService.findAll(query, curent, pageSize);
  }

  async updateStatus(
    storeId: string,
    status: 'active' | 'inactive' | 'violation',
  ) {
    return await this.storeService.updateStatus(storeId, status);
  }
}
