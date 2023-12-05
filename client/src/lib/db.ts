import { createClient } from "redis";

;

const key = {
    url: process.env.REDIS_REST_URL,
    senha: process.env.REDIS_REST_PASSWORD,
    port: process.env.REDIS_REST_PORT

}



const port = key.port ? parseInt(key.port, 10) : undefined;

const client = createClient({
    password: key.senha,
    socket: {
        host: key.url,
        port: port,
    }
});

client.on('error', (err) => console.log(err));

if (!client.isOpen) {
    client.connect();
}

export { client }

