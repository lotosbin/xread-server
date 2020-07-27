import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import crypto from 'crypto';

function md5(data: string) {
    return crypto.createHash('md5').update(data).digest('hex');
}

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });
    let email = process.env.TTRSS_FEVER_USERNAME || '';
    let pass = process.env.TTRSS_FEVER_PASSWORD || '';
    let api_key = `${md5(`${email}:${pass}`)}`;
    it('/api (POST) auth', async () => {
        const response = await request(app.getHttpServer())
            .post('/fever')
            .field('email', email)
            .field('pass', pass)
            .field('api_key', api_key)
            .expect(201);
        expect(response.body.auth).toBe(1);
    });
    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });
    it('fever/recommend/?api&groups (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/fever/recommend?api&groups&api_key=${api_key}`)
            .expect(200);
        expect(response.body.groups.length > 0).toBeTruthy();
    });
});
