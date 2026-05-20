import serverless from 'serverless-http';
import app from '../backend/server.js';

const handler = serverless(app, {
  binary: ['image/*', 'application/pdf'],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => handler(req, res);
