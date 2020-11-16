import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn'],
    });
    await app.listen(process.env.PORT || 4000);
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();
