import type { Config } from '@netlify/functions';
import serverless from 'serverless-http';
import app from '../../server.js';

export default async (request: Request) => {
    const url = new URL(request.url);
    const handler = serverless(app, { binary: ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] });
    const body = request.method === 'GET' || request.method === 'HEAD'
        ? undefined : Buffer.from(await request.arrayBuffer()).toString('base64');
    const result = await handler({
        httpMethod: request.method,
        path: url.pathname,
        headers: Object.fromEntries(request.headers),
        multiValueQueryStringParameters: Object.fromEntries(
            [...new Set(url.searchParams.keys())].map(key => [key, url.searchParams.getAll(key)])
        ),
        body,
        isBase64Encoded: body !== undefined,
        requestContext: { identity: {} },
    }, {}) as { statusCode: number; headers: Record<string, string>; body: string; isBase64Encoded?: boolean };
    return new Response(request.method === 'HEAD' ? null : Buffer.from(result.body || '', result.isBase64Encoded ? 'base64' : 'utf8'), {
        status: result.statusCode,
        headers: result.headers,
    });
};

export const config: Config = { path: '/api/*' };
