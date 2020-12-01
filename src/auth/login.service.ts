import { Service } from 'typedi';
import { ILoginReq, ILoginRes } from './auth.protocol';
import { AuthService } from './auth.service';
import { ServerErrorCode } from '../common/errorCode';
import { getCustomRepository } from 'typeorm';
import { AccountRepository } from '../entity/account.repo';
import { Account } from '../entity/account.entity';
import { createAccessToken } from '../common/utility';

@Service()
export class LoginService {
    constructor(private authService: AuthService) {}

    async login(loginReq: ILoginReq): Promise<ILoginRes> {
        this.authService.setDefaultErrCode(ServerErrorCode.LOGIN_FAIL);
        const oauthAccessToken = loginReq.oauthAccessToken || loginReq.deviceId;

        const oauthSignId: string = await this.authService.getProviderOauthSignId(
            oauthAccessToken,
            loginReq.oauthSignProvider,
        );

        const accountRepo = getCustomRepository(AccountRepository);

        let accountId = await accountRepo.getAccountId(
            oauthSignId,
            loginReq.oauthSignProvider,
        );

        if (accountId == undefined) {
            const account = new Account();
            account.oauth_sign_id = oauthSignId;
            account.oauth_sign_provider = loginReq.oauthSignProvider;
            account.lang = loginReq.lang;
            account.os = loginReq.os;
            account.location = loginReq.location;
            const result = await accountRepo.save(account);
            if (result != undefined) {
                accountId = result.id;
            }
        }

        if (accountId == undefined) {
            this.authService.throwError(
                `Invalid login request -> ${JSON.stringify(loginReq)}`,
            );
        }
        return { token: createAccessToken(accountId) };
    }
}
