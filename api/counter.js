// API Route pour le compteur de visites avec Upstash Redis

export default async function handler(req, res) {
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
    const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
        return res.status(500).json({ error: 'Redis not configured' });
    }
    
    try {
        // Incrémenter le compteur
        const response = await fetch(`${UPSTASH_URL}/incr/valentine_visits`, {
            headers: {
                Authorization: `Bearer ${UPSTASH_TOKEN}`
            }
        });
        
        const data = await response.json();
        const count = data.result;
        
        return res.status(200).json({ count });
    } catch (error) {
        console.error('Redis error:', error);
        return res.status(500).json({ error: 'Counter error', count: 0 });
    }
}
