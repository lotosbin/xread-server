import { Module } from '@nestjs/common';
import { TtrssService } from './ttrss.service';
import { TtrssController } from './ttrss.controller';

@Module({
  providers: [TtrssService],
  controllers: [TtrssController]
})
export class TtrssModule {}
