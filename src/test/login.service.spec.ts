import { AuthService } from '../auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { OauthSignProvider, Platform } from '../common/enum';
import { ILoginReq } from '../auth/auth.protocol';
import { getConnection, createConnection } from 'typeorm';
import { useConfig } from '../common/config';
import { ServerError } from '../common/error';
import { LoginService } from '../auth/login.service';

describe('LoginService Test', () => {
    let service: LoginService;
    beforeAll(async () => {
        //        await useConfigForTest();
        useConfig('test');
        await createConnection();
        service = new LoginService(new AuthService());
    });

    afterAll(async () => {
        getConnection().close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('login success', async () => {
        const loginReq: ILoginReq = {
            oauthSignProvider: OauthSignProvider.GUEST,
            deviceId: uuidv4(),
            oauthAccessToken: uuidv4(),
            os: Platform.OTHER,
            lang: 'en',
        };
        const loginRes = await service.login(loginReq);
        expect(loginRes).toBeDefined();
    });

    it('google login fail by invalid access token', async () => {
        const loginReq: ILoginReq = {
            oauthSignProvider: OauthSignProvider.GOOGLE,
            deviceId: uuidv4(),
            oauthAccessToken: uuidv4(),
            os: Platform.ANDROID,
            lang: 'en',
        };
        await expect(service.login(loginReq)).rejects.toThrow(ServerError);
    });

    it('google login fail by invalid access token', async () => {
        const loginReq: ILoginReq = {
            oauthSignProvider: OauthSignProvider.FACEBOOK,
            deviceId: uuidv4(),
            oauthAccessToken: uuidv4(),
            os: Platform.ANDROID,
            lang: 'en',
        };
        await expect(service.login(loginReq)).rejects.toThrow(ServerError);
    });
});
