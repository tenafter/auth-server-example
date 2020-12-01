import { ServerErrorCode } from './errorCode';

export interface IErrorRes {
    errCode?: ServerErrorCode;
    errMsg?: string;
}
