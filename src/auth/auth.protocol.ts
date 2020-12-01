/* eslint-disable @typescript-eslint/no-empty-interface */
import { OauthSignProvider, Platform } from '../common/enum';

/**
 * 로그인 요청
 */
export interface ILoginReq {
    oauthSignProvider: OauthSignProvider;
    deviceId?: string;
    oauthAccessToken?: string;
    lang?: string;
    location?: string;
    os?: Platform;
}

/**
 * 로그인 응답
 */
export interface ILoginRes {
    token: string;
}

export interface IOAuthSignInReq {
    oauthSignProvider: OauthSignProvider;
    oauthAccessToken: string;
}

export interface IOAuthSignInRes {
    token: string;
}

export interface IOAuthSignOutReq {
    oauthSignProvider: OauthSignProvider;
    oauthAccessToken: string;
}

export interface IOAuthSignOutRes {
    token: string;
}

export interface IRefreshReq {}

export interface IRefreshRes {
    accessToken: string;
    refreshToken: string;
}
