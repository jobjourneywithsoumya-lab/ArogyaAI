/** Lightweight health check — always available at /api/health */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ status: 'ArogyaAI Backend is running', ok: true });
}
