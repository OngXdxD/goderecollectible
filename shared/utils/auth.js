export const refreshTokens = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh-token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/refresh-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    localStorage.setItem('access-token', data.access.token);
    localStorage.setItem('refresh-token', data.refresh.token);
    return data.access.token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear tokens and redirect to login
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    window.location.href = '/';
    throw error;
  }
};

export const fetchWithTokenRefresh = async (url, options = {}) => {
  try {
    // First attempt with current access token
    const token = localStorage.getItem('access-token');
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    // If unauthorized, try to refresh token and retry the request
    if (response.status === 401) {
      const newToken = await refreshTokens();
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        },
      });
      return retryResponse;
    }

    return response;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}; 