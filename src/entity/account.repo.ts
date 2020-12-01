import { EntityRepository, Repository } from 'typeorm';
import { Account } from './account.entity';
import { OauthSignProvider } from '../common/enum';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
    async getAccountId(
        oauthSignId: string,
        oauthSignProvider: OauthSignProvider,
    ): Promise<any> {
        return this.createQueryBuilder('account')
            .select(['account.id'])
            .where('oauth_sign_id = :oauthSignId', { oauthSignId })
            .andWhere('oauth_sign_provider = :oauthSignProvider', {
                oauthSignProvider,
            })
            .getOne();
    }
}
