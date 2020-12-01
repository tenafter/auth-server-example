import { Body, JsonController, Post, UseBefore } from 'routing-controllers';
import {
    ILoginReq,
    ILoginRes,
    IOAuthSignInReq,
    IOAuthSignInRes,
} from './auth.protocol';
import { OpenAPI } from 'routing-controllers-openapi';
import { HttpStatus } from '../common/httpStatus';
import { verifyHeaderJwt } from '../common/utility';
import { Response } from 'express';
import { Res } from 'routing-controllers';
import { LoginService } from './login.service';
import { SignInService } from './signin.service';
import { RefreshService } from './refresh.service';
import { IJwtPayload } from '../common/interface';
import { IRefreshRes } from './auth.protocol';

@JsonController()
export class AuthController {
    constructor(
        private loginService: LoginService,
        private signInService: SignInService,
        private refreshService: RefreshService,
    ) {}

    @OpenAPI({
        summary: '유저의 구글/페이스북/게스트 로그인',
        description:
            '구글/페이스북의 엑세스코드를 받아서 계정의 로그인을 처리함. 미가입 유저인 경우 자동가입 처리됨',
    })
    @Post('/login')
    async login(@Body() loginReq: ILoginReq): Promise<ILoginRes> {
        return await this.loginService.login(loginReq);
    }

    @Post('/signin')
    @OpenAPI({
        summary: '게스트 유저의 가입 전환',
        description:
            '디바이스아이디로 생성된 계정을 구글/페이스북 계정으로 연동',
    })
    @UseBefore(verifyHeaderJwt)
    async signIn(
        @Res() res: Response,
        @Body() signInReq: IOAuthSignInReq,
    ): Promise<IOAuthSignInRes> {
        const accountId: string = res.locals.jwtPayload.sub;
        return await this.signInService.signIn(accountId, signInReq);
    }

    @OpenAPI({
        summary: '게스트 유저의 계정 연동 취소',
        description:
            '구글/페이스북 계정 연동된 유저를 게스트 계정 상태로 되돌림',
        request: 'IOAuthSignInReq',
        statusCode: `${HttpStatus.OK} - ${HttpStatus.OK.toString()}`,
        retsponse: 'IOAuthSignInRes',
    })
    @Post('/refresh')
    @UseBefore(verifyHeaderJwt)
    refresh(@Res() res: Response): IRefreshRes {
        return this.refreshService.refreshToken(
            res.locals.jwtPayload as IJwtPayload,
        );
    }
}
