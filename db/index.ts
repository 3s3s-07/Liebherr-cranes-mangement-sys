import { drizzle } from 'drizzle-orm/netlify-db';
import * as schema from './schema.js';

// Netlify supplies the connection for the current deployment context.
export const db = drizzle({ schema });
