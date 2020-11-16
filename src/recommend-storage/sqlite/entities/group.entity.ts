import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'group' })
export class GroupEntity {
    constructor(id: number, title: string, feed_ids: string) {
        this.id = id;
        this.title = title;
        this.feed_ids = feed_ids;
    }

    @PrimaryColumn({ type: 'integer' })
    id: number;

    @Column('text')
    title: string;

    @Column('text')
    feed_ids: string;
}
