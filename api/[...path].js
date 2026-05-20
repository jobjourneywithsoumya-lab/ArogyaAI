import serverless from 'serverless-http';
import app from '../backend/server.js';

const handler = serverless(app);

export default async (req, res) => handler(req, res);
