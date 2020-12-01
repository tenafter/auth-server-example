import { Service } from 'typedi';
import httpService from 'axios';
import { CONFIG } from '../common/config';
import { HttpStatus } from '../common/httpStatus';
import { ServerError } from '../common/error';
import { ServerErrorCode } from '../common/errorCode';
import { OauthSignProvider } from '../common/enum';

@Service()
export class AuthService {
    private errCode: ServerErrorCode;
    public setDefaultErrCode(errCode: ServerErrorCode) {
        this.errCode = errCode;
    }

    public async getProviderOauthSignId(
        oauthAccessToken: string,
        oauthSignProvider: string,
    ) {
        let oauthSignId: string;
        switch (oauthSignProvider) {
            case OauthSignProvider.FACEBOOK:
                oauthSignId = await this.facebookTokenVerify(oauthAccessToken);
                break;
            case OauthSignProvider.GOOGLE:
                oauthSignId = await this.googleTokenVerify(oauthAccessToken);
                break;
            case OauthSignProvider.GUEST:
                oauthSignId = oauthAccessToken;
                break;
            default:
                this.throwError(
                    `Invalid OauthSignProvider type -> ${oauthSignProvider}`,
                );
        }
        return oauthSignId;
    }

    private async googleTokenVerify(accessToken: string): Promise<string> {
        let result: any;
        const query = `${CONFIG().GOOGLE.TOKEN_VERIRY_URI}${accessToken}`;
        try {
            result = await httpService.get(query);
            if (result.data.aud != CONFIG().GOOGLE.APP_ID) {
                this.throwError(`Invalid google access token`);
            }
        } catch (err) {
            this.throwError(`Invalid google access token`);
        }
        return result.data.sub; // google id
    }

    private async facebookTokenVerify(accessToken: string): Promise<string> {
        let response: any;
        // input_token : 유저의 엑세스 토큰
        // access_token : 앱의 엑세스 토큰
        const query = `${
            CONFIG().FACEBOOK.TOKEN_VERIRY_URI
        }?input_token=${accessToken}&access_token=${
            CONFIG().FACEBOOK.APP_TOKEN
        }`;
        try {
            response = await httpService.get(query);
        } catch (error) {
            this.throwError('Invalid facebook access token');
        }
        return response.data.user_id; // facebook id
    }

    public throwError(errMsg: string) {
        throw new ServerError(this.errCode, HttpStatus.BAD_REQUEST, errMsg);
    }
}
