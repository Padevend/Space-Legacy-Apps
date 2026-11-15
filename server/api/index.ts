import { Hono } from 'hono';
import { createServer } from '../bin/server.js';

const app = new Hono();
const serverApp = createServer();

app.route('/', serverApp);
app.route('/api', serverApp);

export default app;
