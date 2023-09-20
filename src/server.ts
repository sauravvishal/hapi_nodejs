import dotenv from 'dotenv';
import * as Hapi from '@hapi/hapi';
import { Server } from '@hapi/hapi';

import { config } from './config';
import { AppDataSource } from './database';
import { authController, userController } from './controllers';
import { jwtService } from '../src/services';

dotenv.config();

const init = async () => {
    try {
        const server: Server = Hapi.server({
            port: config.PORT,
            host: 'localhost'
        });
        
        await server.register(require('hapi-auth-jwt2'));

        server.auth.strategy('jwt', 'jwt', {
            key: config.JWT_SECRET,
            validate: jwtService.validate,
            verifyOptions: { algorithms: ['HS256'] }
        });

        server.auth.default('jwt');

        server.route([
            {
                method: 'GET',
                path: '/test',
                handler: () => {
                    return { status: 200, message: 'Everything is working fine !!!', data: null };
                }
            },
            ...authController(),
            ...userController()
        ]);
        AppDataSource.initialize()
            .then(async () => {
                await server.start();
                console.log(`Server is running at : ${server.info.uri}`);
            })
            .catch((error) => {
                console.log(error)
            })
        ;
    } catch (error) {
        console.log(error)
    }
};

process.on('unhandledRejection', (err) => {
    console.log('===', { err });
    process.exit(1);
});

export default init;