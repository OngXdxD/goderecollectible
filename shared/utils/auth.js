export const refreshTokens = async () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('Cannot refresh tokens on the server side');
    }
    
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      window.location.href = '/';
    }
    throw error;
  }
};

export const fetchWithTokenRefresh = async (url, options = {}) => {
  try {
    // First attempt with current access token
    let token;
    
    // Check if we're in a browser environment before trying to access localStorage
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access-token');
    }
    
    // Prepare headers with or without authorization token
    const headers = {
      ...options.headers,
    };
    
    // Only add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If unauthorized, try to refresh token and retry the request
    if ((response.status === 401 || response.status === 500 ) && token) {
      try {
        const newToken = await refreshTokens();
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
          },
        });
        return retryResponse;
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear tokens and return the original unauthorized response
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access-token');
          localStorage.removeItem('refresh-token');
        }
        return response;
      }
    }

    return response;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}; 