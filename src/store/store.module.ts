import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreResolver } from './store.resolver';

@Module({
    providers: [StoreService, StoreResolver],
    exports: [StoreService],
})
export class StoreModule {}
