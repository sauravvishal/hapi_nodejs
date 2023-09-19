import { UpdateDateColumn, CreateDateColumn } from 'typeorm';

export class Common {
    @CreateDateColumn({
        default: () => 'CURRENT_TIMESTAMP',
        type: 'datetime',
        name: 'created_at',
    })
    createdAt!: Date;

    @UpdateDateColumn({
        default: () => 'CURRENT_TIMESTAMP',
        type: 'datetime',
        name: 'updated_at',
    })
    updatedAt!: Date;
}
