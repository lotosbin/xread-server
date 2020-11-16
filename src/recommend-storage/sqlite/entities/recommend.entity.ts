import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'recommend' })
export class RecommendEntity {
    constructor(id: number, feed_id: number, created_on_time: number) {
        this.id = id;
        this.feed_id = feed_id;
        this.created_on_time = created_on_time;
    }

    @PrimaryColumn({ type: 'integer' })
    id: number;

    @Column({
        type: 'integer',
        default: 0,
    })
    feed_id: number;

    @Column({
        type: 'integer',
        default: 0,
    })
    created_on_time: number;
}
