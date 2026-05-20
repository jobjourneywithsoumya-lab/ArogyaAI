import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ASSISTANT_INSTRUCTIONS = `
You are ArogyaAI Assistant, a friendly AI helper inside a healthcare and well-being web app.
Your primary role is to help users with general healthcare and wellness questions when a doctor is not immediately available.
Answer symptoms and health questions directly with practical first-aid style guidance, possible common causes, self-care steps, red-flag warning signs, and when to see a doctor.
You may guide users to app features only when it clearly helps, but do not make every answer about opening pages.
For health symptoms, give general educational guidance, ask clarifying questions when useful, and recommend contacting a qualified doctor for diagnosis or treatment.
For emergency symptoms such as chest pain, severe breathing difficulty, fainting, stroke signs, severe allergic reaction, or heavy bleeding, tell the user to seek emergency medical help immediately.
Never claim to diagnose, prescribe, or replace a doctor.
Keep answers clear, practical, and short enough for a chat window.
`;

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });

const extractText = (data) => {
  if (data.output_text) return data.output_text;

  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && content.text) {
        chunks.push(content.text);
      }
    }
  }
  return chunks.join('\n').trim();
};

const assistantApiPlugin = () => ({
  name: 'emergency-boot-assistant-api',
  configureServer(server) {
    server.middlewares.use('/api/assistant', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
      }

      if (!process.env.OPENAI_API_KEY) {
        res.statusCode = 501;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          error: 'OPENAI_API_KEY is not configured. Add it to a .env file and restart the dev server.'
        }));
        return;
      }

      try {
        const { messages = [] } = await readJsonBody(req);
        const input = messages.slice(-12).map(message => ({
          role: message.isBot ? 'assistant' : 'user',
          content: message.text
        }));

        const response = await fetch('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
            instructions: ASSISTANT_INSTRUCTIONS,
            input
          })
        });

        const data = await response.json();
        if (!response.ok) {
          res.statusCode = response.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: data.error?.message || 'AI request failed' }));
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ reply: extractText(data) || 'I could not generate a response right now.' }));
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error.message || 'Assistant server error' }));
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), assistantApiPlugin()],
})
