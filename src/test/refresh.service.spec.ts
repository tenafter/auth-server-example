import { AuthService } from '../auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { getConnection, createConnection } from 'typeorm';
import { useConfig, CONFIG } from '../common/config';
import { ServerError } from '../common/error';
import { RefreshService } from '../auth/refresh.service';
import { IJwtPayload } from '../common/interface';

describe('RefreshService Test', () => {
    let service: RefreshService;
    const authService: AuthService = new AuthService();
    beforeAll(async () => {
        //        await useConfigForTest();
        useConfig('test');
        await createConnection();
        service = new RefreshService(authService);
    });

    afterAll(async () => {
        getConnection().close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('refresh token success', () => {
        const fakeAccountId = uuidv4();
        const jwtPayload: IJwtPayload = {
            sub: fakeAccountId,
            exp: Date.now() + CONFIG().JWT.REFRESH_EXP_SEC * 1000,
            iat: Date.now(),
        };

        const response = service.refreshToken(jwtPayload);
        expect(response.accessToken).toBeDefined();
        expect(response.refreshToken).toBeDefined();
    });

    it('refresh token expired fail', () => {
        const fakeAccountId = uuidv4();
        const invalidPayload: IJwtPayload = {
            sub: fakeAccountId,
            exp: Date.now() - CONFIG().JWT.REFRESH_EXP_SEC * 1000,
            iat: Date.now(),
        };
        expect(() => service.refreshToken(invalidPayload)).toThrow(ServerError);
    });
});
