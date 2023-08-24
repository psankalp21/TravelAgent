import { createClient } from 'redis';
export function redis_connect()
{
    const client = createClient();
    client.on('error', err => console.log('Redis Client Error', err));
    client.connect();
}

