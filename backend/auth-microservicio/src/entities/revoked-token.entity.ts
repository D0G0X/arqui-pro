import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('revoked_tokens')
export class RevokedToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    token: string;

    @CreateDateColumn({ type: 'timestamp' })
    revocado_en: Date;

    @Column({ type: 'timestamp' })
    expira_en: Date;
}
