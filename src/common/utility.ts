import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { CONFIG } from './config';
import { IJwtPayload } from './interface';
import { ServerErrorCode } from './errorCode';
import { HttpStatus } from './httpStatus';
import { IErrorRes } from './protocol';

/**
 * 헤더의 Jwt 토큰 유효 검사
 * @param req
 * @param res
 * @param next
 */
export const verifyHeaderJwt = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = getJwt(req);
    let jwtPayload: IJwtPayload;

    try {
        jwtPayload = jwt.verify(token, CONFIG().JWT.SECRET);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        const errRes: IErrorRes = {
            errCode: ServerErrorCode.JWT_INVALID,
            errMsg: 'Invalid or Missing JWT token',
        };
        return res.status(HttpStatus.UNAUTHORIZED).send(errRes);
    }

    next();
};

/**
 * 헤더에서 Jwt을 가져옴.
 * @param req
 */
const getJwt = (req: Request) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] == 'Bearer') {
        return authHeader.split(' ')[1];
    }
};

export function createAccessToken(accountId: string): string {
    const payload: IJwtPayload = {
        sub: accountId,
        exp: Date.now() + CONFIG().JWT.EXP_SEC * 1000,
        iat: Date.now(),
    };
    return jwt.sign(payload, CONFIG().JWT.SECRET);
}

export function createRefreshToken(accountId: string): string {
    const payload: IJwtPayload = {
        sub: accountId,
        exp: Date.now() + CONFIG().JWT.REFRESH_EXP_SEC * 1000,
        iat: Date.now(),
    };
    return jwt.sign(payload, CONFIG().JWT.SECRET);
}
