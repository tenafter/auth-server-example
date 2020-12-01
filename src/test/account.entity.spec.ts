//import 'reflect-metadata';
import { Account } from '../entity/account.entity';
import { createConnection, getCustomRepository, getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OauthSignProvider } from '../common/enum';
import { useConfig } from '../common/config';
import { AccountRepository } from '../entity/account.repo';

describe('Acount 엔티티와 저장소 테스트', () => {
    let account: Account;
    let accountRepo: AccountRepository;
    const oauthSignId = uuidv4();
    const oauthSignProvider = OauthSignProvider.GUEST;
    beforeAll(async () => {
        useConfig('test');
        await createConnection();

        accountRepo = getCustomRepository(AccountRepository);

        account = new Account();
        account.oauth_sign_id = uuidv4();
        account.oauth_sign_provider = OauthSignProvider.GUEST;
    });

    afterAll(async () => {
        getConnection().close();
    });

    it('Account Save', async () => {
        account = new Account();
        account.oauth_sign_id = oauthSignId;
        account.oauth_sign_provider = oauthSignProvider;

        const result = await accountRepo.save(account);
        expect(result.id).toBeDefined();
        expect(result.oauth_sign_id).toEqual(account.oauth_sign_id);
        expect(result.oauth_sign_provider).toEqual(account.oauth_sign_provider);
        account = result;
    });

    it('Account getAccountId', async () => {
        const result = await accountRepo.getAccountId(
            account.oauth_sign_id,
            account.oauth_sign_provider,
        );
        expect(result.id).toEqual(account.id);
    });

    it('Account getAccountId Fail', async () => {
        const result = await accountRepo.getAccountId(
            account.oauth_sign_id,
            OauthSignProvider.GOOGLE,
        );
        expect(result).toBeUndefined();
    });

    it('Account delete', async () => {
        await accountRepo.delete(account.id);
        const result = await accountRepo.findOne(account.id);
        expect(result).toBeUndefined();
    });
});
