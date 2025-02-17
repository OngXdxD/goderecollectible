import { useState } from 'react';

export default function WixAuth() {
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getAccessToken = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://www.wixapis.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: process.env.NEXT_PUBLIC_APP_ID,
          client_secret: process.env.NEXT_PUBLIC_APP_SECRET_KEY,
          instance_id: process.env.NEXT_PUBLIC_APP_INSTANCE_ID
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get access token');
      }
      
      setAccessToken(data.access_token);
      console.log('Full response:', data); // This will show all the response data
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Wix Authentication</h1>
      
      <button 
        onClick={getAccessToken}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Getting Token...' : 'Get Access Token'}
      </button>

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '5px'
        }}>
          Error: {error}
        </div>
      )}

      {accessToken && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ marginBottom: '10px' }}>Access Token:</h2>
          <div style={{
            padding: '15px',
            backgroundColor: '#f5f5f5',
            borderRadius: '5px',
            wordBreak: 'break-all',
            fontFamily: 'monospace'
          }}>
            {accessToken}
          </div>
        </div>
      )}
    </div>
  );
} 