import { AuthService } from './auth.service';
import { Service } from 'typedi';
import { ServerErrorCode } from '../common/errorCode';
import { IJwtPayload } from '../common/interface';
import { createRefreshToken, createAccessToken } from '../common/utility';
import { logger } from '../common/logger';
import { IRefreshRes } from './auth.protocol';

@Service()
export class RefreshService {
    constructor(private authService: AuthService) {}

    refreshToken(jwtPayload: IJwtPayload): IRefreshRes {
        this.authService.setDefaultErrCode(ServerErrorCode.REFRESH_FAIL);

        const accountId = jwtPayload.sub;
        logger.debug(
            `exp: ${jwtPayload.exp}, now: ${Date.now()}, diff: ${Date.now() -
                jwtPayload.exp}`,
        );
        if (jwtPayload.exp < Date.now()) {
            this.authService.setDefaultErrCode(
                ServerErrorCode.REFRESH_FAIL_NEED_TO_LOGIN,
            );
            const errMsg = 'refresh token expired, need to login';
            logger.error(
                `${errMsg} -> accountId:${accountId}, req: ${JSON.stringify(
                    jwtPayload,
                )}`,
            );
            this.authService.throwError(errMsg);
        }

        return {
            accessToken: createAccessToken(accountId),
            refreshToken: createRefreshToken(accountId),
        };
    }
}
