import { Controller, Get } from '@nestjs/common';
import { RecommendTaskService } from './recommend-task.service';

@Controller('recommend')
export class RecommendController {
    constructor(private taskService: RecommendTaskService) {}

    @Get()
    async get() {
        return this.taskService.parse();
    }
}
