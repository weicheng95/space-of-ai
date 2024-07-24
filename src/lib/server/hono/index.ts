import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { apiV1Router } from './routes/api';
import { logger } from 'hono/logger';

declare module 'hono' {
  interface ContextVariableMap {
    user: any
  }
}

const app = new Hono({
	strict: false
});

app.use(logger());

app.use(
	'*',
	cors({
		origin: '*',
		credentials: true,
		exposeHeaders: ['content-length'],
		maxAge: 3600
	})
);
// app.use('*', setAuthToken());
app.route('/api/v1', apiV1Router);

export default app;
