import { HttpError } from 'routing-controllers';
import { ServerErrorCode } from './errorCode';
import { IErrorRes } from './protocol';

/**
 * 서버 에러 정의
 */
export class ServerError extends HttpError {
    constructor(
        private errCode: ServerErrorCode,
        httpCode: number,
        private errMsg?: string,
    ) {
        super(httpCode, errMsg);
        Object.setPrototypeOf(this, ServerError.prototype);
    }

    toJSON() {
        const res: IErrorRes = {
            errCode: this.errCode,
            errMsg: this.errMsg,
        };
        return res;
    }
}
