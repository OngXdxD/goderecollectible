export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://www.wixapis.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.WIX_APP_ID,
        client_secret: process.env.WIX_APP_SECRET_KEY,
        instance_id: process.env.WIX_APP_INSTANCE_ID
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get access token');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error getting Wix access token:', error);
    return res.status(500).json({ 
      message: 'Error getting access token', 
      error: error.message 
    });
  }
} 