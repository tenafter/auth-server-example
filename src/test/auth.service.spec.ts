import { AuthService } from '../auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { OauthSignProvider } from '../common/enum';
import { getConnection, createConnection } from 'typeorm';
import { useConfig, CONFIG } from '../common/config';
import * as jwt from 'jsonwebtoken';
import { ServerError } from '../common/error';
import { ServerErrorCode } from '../common/errorCode';
import { IJwtPayload } from '../common/interface';
import { createAccessToken } from '../common/utility';

describe('AuthService Test', () => {
    let service: AuthService;
    beforeAll(async () => {
        useConfig('test');
        await createConnection();
        service = new AuthService();
    });

    afterAll(async () => {
        getConnection().close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('throwError() OK ', () => {
        service.setDefaultErrCode(ServerErrorCode.LOGIN_FAIL);
        expect(() => {
            service.throwError('valid throw error');
        }).toThrow('valid throw error');
    });

    it('createToken() OK', async () => {
        const fakeAccountId: string = uuidv4();
        const token = createAccessToken(fakeAccountId);
        expect(token).toBeDefined();
        const jwtPayload: IJwtPayload = jwt.verify(token, CONFIG().JWT.SECRET);
        expect(fakeAccountId).toEqual(jwtPayload.sub);
    });

    it('getProviderOauthSignId() GUEST Success', async () => {
        const fakeAccountId: string = uuidv4();
        const fakeToken = createAccessToken(fakeAccountId);
        await expect(
            service.getProviderOauthSignId(fakeToken, OauthSignProvider.GOOGLE),
        ).rejects.toThrow(ServerError);
    });

    it('getProviderOauthSignId() GOOGLE Fail', async () => {
        const fakeAccountId: string = uuidv4();
        const fakeToken = createAccessToken(fakeAccountId);
        await expect(
            service.getProviderOauthSignId(fakeToken, OauthSignProvider.GOOGLE),
        ).rejects.toThrow(ServerError);
    });

    it('getProviderOauthSignId() FACEBOOK Fail', async () => {
        const fakeAccountId: string = uuidv4();
        const fakeToken = createAccessToken(fakeAccountId);
        await expect(
            service.getProviderOauthSignId(
                fakeToken,
                OauthSignProvider.FACEBOOK,
            ),
        ).rejects.toThrow(ServerError);
    });
});
