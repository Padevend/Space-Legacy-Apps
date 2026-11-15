import { Hono } from 'hono';
import { createServer, startServer } from './bin/server.js';

const app = new Hono();
const serverApp = createServer();

app.route('/', serverApp);
app.route('/api', serverApp);

export { startServer };
export default app;
