import { Test, TestingModule } from '@nestjs/testing';
import { TtrssService } from './ttrss.service';

describe('TtrssService', () => {
    let service: TtrssService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TtrssService],
        }).compile();

        service = module.get<TtrssService>(TtrssService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should login', async () => {
        var loggedIn = await service.api.isLoggedIn();
        expect(loggedIn).toBeFalsy();
    });
});
