import { getConnection } from 'typeorm';
import { runApp } from '../app';
import * as express from 'express';
import * as request from 'supertest';
import { ILoginReq } from '../auth/auth.protocol';
import { Platform, OauthSignProvider } from '../common/enum';
import { v4 as uuidv4 } from 'uuid';
import { HttpStatus } from '../common/httpStatus';
import { ILoginRes } from '../auth/auth.protocol';
import { ServerErrorCode } from '../common/errorCode';
import { IOAuthSignInReq } from '../auth/auth.protocol';
import { createRefreshToken, createAccessToken } from '../common/utility';
import { IErrorRes } from '../common/protocol';
import { CONFIG } from '../common/config';
import * as jwt from 'jsonwebtoken';
import { IJwtPayload } from '../common/interface';

// Auth controller e2e test
describe('Auth Controller', () => {
    let app: express.Application;
    beforeAll(async () => {
        app = await runApp('test');
    });

    afterAll(async () => {
        await getConnection().close();
    });

    it('User login success for device id', async () => {
        const loginReq: ILoginReq = {
            oauthSignProvider: OauthSignProvider.GUEST,
            deviceId: uuidv4(),
            os: Platform.OTHER,
            lang: 'en',
        };
        const response = await request(app)
            .post('/login')
            .send(loginReq)
            .expect(HttpStatus.OK);
        const body: ILoginRes = response.body;
        expect(body.token).toBeDefined();
    });

    it('google login success ', async () => {
        const googleAccessToken = process.env.GOOGLE_ACCESS_TOKEN;
        if (googleAccessToken == undefined) return;

        const loginReq: ILoginReq = {
            oauthSignProvider: OauthSignProvider.GOOGLE,
            oauthAccessToken: googleAccessToken,
            os: Platform.ANDROID,
            lang: 'en',
            location: '',
        };

        const response = await request(app)
            .post('/login')
            .send(loginReq)
            .expect(HttpStatus.BAD_REQUEST);
        const body: IErrorRes = response.body;
        expect(body.errCode).toEqual(ServerErrorCode.LOGIN_FAIL);
    });

    it('facebook login success ', async () => {
        const facebookAccessToken = process.env.GOOGLE_ACCESS_TOKEN;
        if (facebookAccessToken == undefined) return;

        const loginReq: ILoginReq = {
            oauthSignProvider: OauthSignProvider.GOOGLE,
            oauthAccessToken: facebookAccessToken,
            os: Platform.IOS,
            lang: 'en',
            location: '',
        };

        const response = await request(app)
            .post('/login')
            .send(loginReq)
            .expect(HttpStatus.BAD_REQUEST);
        const body: IErrorRes = response.body;
        expect(body.errCode).toEqual(ServerErrorCode.LOGIN_FAIL);
    });

    it('google login fail by invalid OauthSignProvider', async () => {
        const loginReq: ILoginReq = {
            oauthSignProvider: undefined as OauthSignProvider,
            deviceId: uuidv4(),
            oauthAccessToken: uuidv4(),
            os: Platform.ANDROID,
            lang: 'en',
        };
        const response = await request(app)
            .post('/login')
            .send(loginReq)
            .expect(HttpStatus.BAD_REQUEST);
        const body: IErrorRes = response.body;
        expect(body.errCode).toEqual(ServerErrorCode.LOGIN_FAIL);
    });

    it('google login success ', async () => {
        const googleAccessToken = process.env.GOOGLE_ACCESS_TOKEN;
        if (googleAccessToken == undefined) return;

        const loginReq: ILoginReq = {
            oauthSignProvider: undefined as OauthSignProvider,
            oauthAccessToken: googleAccessToken,
            os: Platform.ANDROID,
            lang: 'en',
        };

        const response = await request(app)
            .post('/login')
            .send(loginReq)
            .expect(HttpStatus.BAD_REQUEST);
        const body: IErrorRes = response.body;
        expect(body.errCode).toEqual(ServerErrorCode.LOGIN_FAIL);
    });

    it('google signin fail', async () => {
        const fakeAccountId = uuidv4();
        const token = createAccessToken(fakeAccountId);
        const googleAccessToken = process.env.GOOGLE_ACCESS_TOKEN;
        if (googleAccessToken == undefined) return;

        const signInReq: IOAuthSignInReq = {
            oauthSignProvider: undefined as OauthSignProvider,
            oauthAccessToken: googleAccessToken,
        };

        const response = await request(app)
            .post('/signin')
            .send(signInReq)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.BAD_REQUEST);
        const body: IErrorRes = response.body;
        expect(body.errCode).toEqual(ServerErrorCode.SIGNIN_FAIL);
    });

    it('refresh token success', async () => {
        const fakeAccountId = uuidv4();
        const refreshToken = createRefreshToken(fakeAccountId);
        await request(app)
            .post('/refresh')
            .send()
            .set('Authorization', `Bearer ${refreshToken}`)
            .expect(HttpStatus.OK);
    });

    it('refresh token fail', async () => {
        const fakeAccountId = uuidv4();
        const invalidPayload: IJwtPayload = {
            sub: fakeAccountId,
            exp: Date.now() - CONFIG().JWT.EXP_SEC,
            iat: Date.now(),
        };
        const refreshToken = jwt.sign(invalidPayload, CONFIG().JWT.SECRET);

        const response = await request(app)
            .post('/refresh')
            .send()
            .set('Authorization', `Bearer ${refreshToken}`)
            .expect(HttpStatus.BAD_REQUEST);
        const body: IErrorRes = response.body;
        expect(body.errCode).toEqual(
            ServerErrorCode.REFRESH_FAIL_NEED_TO_LOGIN,
        );
    });
});
