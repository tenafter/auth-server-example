import { AuthService } from '../auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { OauthSignProvider } from '../common/enum';
import { IOAuthSignInReq } from '../auth/auth.protocol';
import { getConnection, createConnection } from 'typeorm';
import { useConfig, CONFIG } from '../common/config';
import * as jwt from 'jsonwebtoken';
import { ServerError } from '../common/error';
import { SignInService } from '../auth/signin.service';
import { createRefreshToken } from '../common/utility';

describe('SignInService Test', () => {
    let service: SignInService;
    const authService: AuthService = new AuthService();
    beforeAll(async () => {
        //        await useConfigForTest();
        useConfig('test');
        await createConnection();
        service = new SignInService(authService);
    });

    afterAll(async () => {
        getConnection().close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('signin fail by invalid access token', async () => {
        const fakeAccountId = uuidv4();
        const fakeAccessToken = uuidv4();
        const token = createRefreshToken(fakeAccountId);

        const jwtPayload = jwt.verify(token, CONFIG().JWT.SECRET);

        const signInReq: IOAuthSignInReq = {
            oauthSignProvider: OauthSignProvider.GOOGLE,
            oauthAccessToken: fakeAccessToken,
        };

        await expect(service.signIn(jwtPayload.sub, signInReq)).rejects.toThrow(
            ServerError,
        );
    });
});
