import { Request, ResponseToolkit } from '@hapi/hapi';
import Boom from 'boom';
import Jwt from 'jsonwebtoken';
import { createClient } from 'redis';
import { is_session_active } from '../entities/session.entity';
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.SECRET_KEY;
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();

export const jwtMiddleware = async (request: Request, h: ResponseToolkit) => {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
        console.log("No Header")
        throw Boom.unauthorized('Authorization header missing')
    }

    const token = authorizationHeader.replace('Bearer ', '');

    try {
        const decodedToken = Jwt.verify(token, secretKey);
        console.log(decodedToken)
        const ipAddress = request.info.remoteAddress;
        request.headers.uid = decodedToken.uid;
        const key = `${decodedToken.uid}_${ipAddress}`;
        const s = await client.hGet(key, "session")
        if (s == "active")
            return h.continue;
        else
            throw Boom.unauthorized('Either your session is expired or you are logged out');

    } catch (error) {
        console.log(error)
        throw Boom.unauthorized(error);
    }
};


export const admin_jwtMiddleware = async (request: Request, h: ResponseToolkit) => {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
        console.log("No Header")
        throw Boom.unauthorized('Authorization header missing')
    }

    const token = authorizationHeader.replace('Bearer ', '');

    try {
        var decodedToken = Jwt.verify(token, secretKey);
        request.headers.aid = decodedToken.aid;
    }
    catch (error) {
        console.log(error)
        throw Boom.unauthorized(error);
    }
    const ipAddress = request.info.remoteAddress;
    if (decodedToken.type == 'admin') {
        const key = `${decodedToken.aid}_${ipAddress}`;
        const s = await client.hGet(key, "session")
        if (s == "active")
            return h.continue;
        else if (s == "not active")
            throw Boom.unauthorized('You are logged out');
        else if (s == null) {
            const con = await is_session_active(key);
            switch (con) {
                case 1: return h.continue;
                case 2: throw Boom.unauthorized('Session Expired');
                case 3: throw Boom.unauthorized('You are logged out');
                case 0: throw Boom.unauthorized('Session does not exists');
            }
        }
    }
    throw Boom.unauthorized('Only admins have access to this api');

};

