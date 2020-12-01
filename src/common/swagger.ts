import * as swaggerUiExpress from 'swagger-ui-express';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as express from 'express';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getRoutingControllerOptions } from './config';

export function useSwagger(app: express.Application) {
    // Parse class-validator classes into JSON Schema:
    // const metadatas = (getFromContainer(MetadataStorage) as any)
    //     .validationMetadatas;
    const schemas = validationMetadatasToSchemas({
        refPointerPrefix: '#/components/schemas',
    });

    // Parse routing-controllers classes into OPENAPI spec:
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(
        storage,
        getRoutingControllerOptions(),
        {
            components: {
                schemas,
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            info: {
                title: 'Auth Server',
                description: 'Auth Server API',
                version: '0.1.0',
            },
        },
    );

    app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
}
