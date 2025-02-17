export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://www.wixapis.com/stores/v1/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.WIX_API_KEY,
        'wix-site-id': process.env.WIX_SITE_ID,
        'wix-account-id': process.env.WIX_ACCOUNT_ID
      },
      body: JSON.stringify({
        product: req.body
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ 
      message: 'Error creating product', 
      error: error.message 
    });
  }
} 