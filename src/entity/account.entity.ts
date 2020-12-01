import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    Unique,
} from 'typeorm';
import { Platform, OauthSignProvider } from '../common/enum';

@Entity({ name: 'account' })
@Unique('oauth_sign_key', ['oauth_sign_id', 'oauth_sign_provider'])
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 16, default: 'en' })
    lang: string;

    @Column('varchar', { length: 16, default: 'kr' })
    location: string;

    @Index()
    @Column('varchar', { length: 128, nullable: true })
    oauth_sign_id: string;

    @Index()
    @Column({
        type: 'enum',
        enum: OauthSignProvider,
        default: OauthSignProvider.GUEST,
    })
    oauth_sign_provider: OauthSignProvider;

    @Column({ type: 'enum', enum: Platform, default: Platform.OTHER })
    os: Platform;

    @CreateDateColumn({ type: 'timestamptz' })
    create_time: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    update_time: Date;
}
