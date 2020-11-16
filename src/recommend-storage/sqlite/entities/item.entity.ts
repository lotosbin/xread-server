import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'item' })
export class ItemEntity {
    @PrimaryColumn({ type: 'integer' })
    id: number;

    @Column({ type: 'integer' })
    feed_id: number;

    @Column('text')
    title: string;

    @Column('text')
    author: string;

    @Column('text')
    html: string;

    @Column('text')
    url: string;

    @Column()
    is_saved: boolean;

    @Column()
    is_read: boolean;

    @Column({ type: 'integer' })
    created_on_time: number;
}
