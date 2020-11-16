import { Module } from '@nestjs/common';
import { RecommendService } from './recommend.service';
import { RecommendBaiduService } from './recommend-baidu.service';
import { RecommendTaskService } from './recommend-task.service';
import { Repository } from 'typeorm';
import { Client } from 'baidu-aip-easedl';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RecommendController } from './recommend.controller';
import { FeverApiModule } from '../fever-api/fever-api.module';
import { RecommendStorageModule } from '../recommend-storage/recommend-storage.module';

@Module({
    imports: [
        FeverApiModule,
        ConfigModule,
        RecommendStorageModule,
    ],
    providers: [
        ConfigService,
        { provide: RecommendService, useClass: RecommendBaiduService },

        RecommendTaskService,
        Repository,
        {
            provide: Client,
            useFactory: (config: ConfigService) =>
                new Client(config.get<string>('BAIDU_AIP_EASEDL_API_KEY'), config.get<string>('BAIDU_AIP_EASEDL_SECRET_KEY'), {
                    text_cls_endpoint: `https://aip.baidubce.com/rpc/2.0/ai_custom/v11/text_cls/recommend_priority`,
                }),
            inject: [ConfigService],
        },
    ],
    exports: [RecommendService],
    controllers: [RecommendController],
})
export class RecommendModule {
}
