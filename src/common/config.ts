import * as dotenv from 'dotenv';
import * as path from 'path';
import { AuthController } from '../auth/auth.controller';
import { ServerErrorHandler } from './middleware';

let config: any;

export function useConfig(configType: 'normal' | 'test' = 'normal') {
    if (configType == 'test') {
        dotenv.config({ path: path.join(process.cwd(), '.env.test') });
    } else {
        dotenv.config({ path: path.join(process.cwd(), '.env') });
    }

    config = {
        PORT: parseInt(process.env.PORT) || 3000,
        JWT: {
            SECRET: process.env.JWT_SECRET,
            EXP_SEC: parseInt(process.env.JWT_EXP_SEC) || 3600,
            REFRESH_EXP_SEC: parseInt(process.env.JWT_REFRESH_EXP_SEC) || 43200,
        },
        FACEBOOK: {
            APP_ID: process.env.FACEBOOK_APP_ID,
            APP_SECRET: process.env.FACEBOOK_APP_SECRET,
            CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,
            TOKEN_VERIRY_URI: process.env.GOOGLE_TOKEN_VERIRY_URI,
            APP_TOKEN: process.env.FACEBOOK_APP_TOKEN,
        },
        GOOGLE: {
            APP_ID: process.env.GOOGLE_APP_ID,
            APP_SECRET: process.env.GOOGLE_APP_SECRET,
            CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
            TOKEN_VERIRY_URI: process.env.GOOGLE_TOKEN_VERIRY_URI,
        },
    };
}

export function CONFIG() {
    return config;
}

export function getRoutingControllerOptions() {
    return {
        controllers: [AuthController],
        middlewares: [ServerErrorHandler],
    };
}
