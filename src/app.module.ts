import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeverModule } from './fever/fever.module';
import { FeverController } from './fever/fever.controller';
import { FeverRecommendController } from './fever-recommend/fever-recommend.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendModule } from './recommend/recommend.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FeverApiModule } from './fever-api/fever-api.module';
import { StoreModule } from './store/store.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { FeedModule } from './feed/feed.module';
import { FeedFeverModule } from './feed-fever/feed-fever.module';
import { FeedLocalModule } from './feed-local/feed-local.module';
import { FeedRecommendModule } from './feed-recommend/feed-recommend.module';
import { RecommendStorageModule } from './recommend-storage/recommend-storage.module';
import { FeverRecommendModule } from './fever-recommend/fever-recommend.module';
import { TtrssModule } from './ttrss/ttrss.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            // load: [configuration],
        }),
        FeverModule,
        RecommendModule,
        ScheduleModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        FeverApiModule,
        StoreModule,
        GraphQLModule.forRoot({
            include: [FeedModule, FeedRecommendModule],
            debug: false,
            playground: true,
            installSubscriptionHandlers: true,
            typePaths: ['./**/*.graphql'],
            definitions: {
                path: join(process.cwd(), 'src/graphql.ts'),
                outputAs: 'class',
            },
        }),
        FeedModule,
        FeedFeverModule,
        FeedLocalModule,
        FeedRecommendModule,
        RecommendStorageModule,
        FeverRecommendModule,
        TtrssModule,
    ],
    controllers: [AppController, FeverController, FeverRecommendController],
    providers: [
        AppService,
        ConfigService,
        // {provide: FeverApi, useClass: TTRssFeverApi},
    ],
})
export class AppModule {}
