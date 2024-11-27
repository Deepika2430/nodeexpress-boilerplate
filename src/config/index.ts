import path from 'path';

import dotenv from 'dotenv';
const awsConfig = {
    region: process.env.AWS_REGION || "",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    queueName: process.env.AWS_QUEUE_NAME || "",
    accountId: process.env.AWS_ACCOUNT_ID || "",
    sessionToken: process.env.AWS_SESSION_TOKEN || ""
}
const getEnvConfig = () => {
    dotenv.config();
    const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
    Object.keys(process.env).forEach(key => {
        delete process.env[key];
    });
    return envFile;
};

dotenv.config({
    path: getEnvConfig()
});

interface Config {
    db: {
        host: string,
        user: string,
        pass: string,
        name: string,
        connectionLimit?: number
    },
    app: {
        host: string,
        port: number
    },
    aws: {
        region: string,
        accessKeyId: string,
        secretAccessKey: string,
        accountId: string,
        sessionToken: string
    },
    oidc: {
        domain: string,
        authorizeUrl: string,
        webKeySetUrl: string,
        audience: string,
        tokenUrl: string,
        clientId: string,
        issuer: string,
        redirectUri: string,
        refreshToken: string
    },
    redis: {
        host: string,
        port: number,
    },
    queue: {
        name: string,
        queueProcessingMethod: string
    },
    projectRoot: string
}

const config: Config = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        pass: process.env.DB_PASS || 'postgres',
        name: process.env.DB_NAME || 'dsp',
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '20')
    },
    app: {
        host: process.env.APP_HOST || 'localhost',
        port: parseInt(process.env.APP_PORT || '3000')
    },
    aws: {
        region: awsConfig.region,
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
        accountId: awsConfig.accountId,
        sessionToken: awsConfig.sessionToken
    },
    oidc: {
        domain: process.env.OIDC_DOMAIN || "dev-fulrxmb8tfh5ke8o.us.auth0.com",
        audience: process.env.OIDC_AUDIENCE || "https://dev-fulrxmb8tfh5ke8o.us.auth0.com/api/v2/",
        tokenUrl: process.env.OIDC_TOKEN_URL || "https://dev-fulrxmb8tfh5ke8o.us.auth0.com/oauth/token",
        clientId: process.env.OIDC_CLIENT_ID || "PnEitIqyE34JDNeUZiIbY42zWIkVrilL",
        authorizeUrl: process.env.OIDC_AUTHORIZE_URL || "https://dev-fulrxmb8tfh5ke8o.us.auth0.com/authorize",
        webKeySetUrl: process.env.OIDC_WEB_KEY_SET_URL || "https://dev-fulrxmb8tfh5ke8o.us.auth0.com/.well-known/jwks.json",
        issuer: process.env.OIDC_ISSUER || "https://dev-fulrxmb8tfh5ke8o.us.auth0.com/",
        redirectUri: process.env.OIDC_REDIRECT_URL || "http://localhost:3000/api-docs/oauth2-redirect.html",
        refreshToken: "85wxHiIHqWKg_aq9CoC9PpkGgKZUByqV1TYkCdNHfLYB0"
    },
    redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    queue: {
        name: process.env.QUEUE_NAME || "",
        queueProcessingMethod: "bullmq"
    },
    projectRoot: __dirname.split("\\").includes("src")? path.join(__dirname, "../") : __dirname
}

export default config;