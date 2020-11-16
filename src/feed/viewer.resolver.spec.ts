import { Test, TestingModule } from '@nestjs/testing';
import { ViewerResolver } from './viewer.resolver';

describe('ViewerResolver', () => {
    let resolver: ViewerResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ViewerResolver],
        }).compile();

        resolver = module.get<ViewerResolver>(ViewerResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
