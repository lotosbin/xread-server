import { HttpModule, HttpService, Module } from '@nestjs/common';
import { FeverApi } from './fever-api';
import { TTRssFeverApi } from './fever-api-ttrss';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        HttpModule,
        ConfigModule,
    ],
    providers: [
        ConfigService,
        { provide: FeverApi, useFactory: (configService: ConfigService, httpService: HttpService) => new TTRssFeverApi(configService, httpService), inject: [ConfigService, HttpService] },
    ],
    exports: [FeverApi],
})
export class FeverApiModule {
}
