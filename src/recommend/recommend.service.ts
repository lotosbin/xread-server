import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class RecommendService {
    /**
     * @param id
     * @param text
     * @param label -1-spam,1-recommend
     * */
    async learn(id: string, text: string, label: string) {
        throw new Error('not implement');
    }

    async recommend(text: string): Promise<boolean> {
        throw new Error('not implement');
    }
}
