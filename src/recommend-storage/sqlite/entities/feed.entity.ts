import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'feed' })
export class FeedEntity {
    @PrimaryColumn({ type: 'integer' })
    id: number;

    @Column({ type: 'integer' })
    favicon_id: number;

    @Column('text')
    title: string;

    @Column('text')
    url: string;

    @Column('text')
    site_url: string;

    @Column()
    is_spark: boolean;

    @Column({ type: 'integer' })
    last_updated_on_time: number;

    @Column()
    group_id: number;
}
