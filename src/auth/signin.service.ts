import { Service } from 'typedi';
import { IOAuthSignInReq, IOAuthSignInRes } from './auth.protocol';
import { AuthService } from './auth.service';
import { ServerErrorCode } from '../common/errorCode';
import { getCustomRepository } from 'typeorm';
import { AccountRepository } from '../entity/account.repo';
import { logger } from '../common/logger';
import { createAccessToken } from '../common/utility';

@Service()
export class SignInService {
    constructor(private authService: AuthService) {}
    async signIn(
        accountId: string,
        signInReq: IOAuthSignInReq,
    ): Promise<IOAuthSignInRes> {
        this.authService.setDefaultErrCode(ServerErrorCode.SIGNIN_FAIL);
        const accountRepo = getCustomRepository(AccountRepository);
        const account = await accountRepo.findOne({
            select: ['id'],
            where: { id: accountId },
        });

        if (account && account.id) {
            const oauthSignId = await this.authService.getProviderOauthSignId(
                signInReq.oauthAccessToken,
                signInReq.oauthSignProvider,
            );

            account.oauth_sign_id = oauthSignId;
            account.oauth_sign_provider = signInReq.oauthSignProvider;
            accountRepo.save(account);
        } else {
            const errMsg = 'Invalid account id';
            logger.error(
                `${errMsg} -> accountId:${accountId}, req: ${JSON.stringify(
                    signInReq,
                )}`,
            );
            this.authService.throwError(errMsg);
        }
        return { token: createAccessToken(accountId) };
    }
}
