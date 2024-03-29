import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { redisConfig } from './redis.config';
import { urlConfig } from './url.config';

export async function setSession(app: INestApplication) {
    // const redisClient = new RedisClient().getRedisClient();
    // const redisStore = new RedisStore({
    //     client: redisClient,
    //     ttl: 30,
    // });
    app.use(
        session({
            secret: redisConfig.getSessionKey(),
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 3600000 * 12 * 7,
                domain: urlConfig.getDomainUrl(),
            },
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
}
