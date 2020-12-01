import 'source-map-support/register';
import 'reflect-metadata';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import { createConnection as createDBConnection } from 'typeorm';
import {
    useConfig,
    CONFIG,
    getRoutingControllerOptions,
} from './common/config';
import { stream } from './common/logger';
import { useSwagger } from './common/swagger';

export async function runApp(configType: 'normal' | 'test' = 'normal') {
    // read .env
    useConfig(configType);

    // create database connection
    await createDBConnection();

    // create express server and use middlewares
    const app = express()
        .use(compression())
        .use(bodyParser.json())
        .use(
            bodyParser.urlencoded({
                extended: false,
            }),
        )
        .use(morgan('combined', { stream }));

    // register routing-controllers
    useExpressServer(app, getRoutingControllerOptions());

    // use typedi container
    useContainer(Container);

    useSwagger(app);

    app.listen(CONFIG().PORT);

    console.log(`Auth Server started at Port: ${CONFIG().PORT}`);
    console.log(`API documents : http://localhost:${CONFIG().PORT}/docs`);

    return app;
}
