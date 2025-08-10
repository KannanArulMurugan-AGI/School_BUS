// A simple service for interacting with the Subscription Manager backend.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

/**
 * Fetches a custom Firebase token from the backend.
 * @param {object} authPayload - The data needed to get a token.
 * @param {string} authPayload.userId - The user's unique ID.
 * @param {string} authPayload.tenantId - The tenant ID the user belongs to.
 * @param {string} authPayload.role - The user's role (e.g., 'parent', 'admin').
 * @returns {Promise<string>} A promise that resolves with the custom token.
 */
const getCustomToken = async ({ userId, tenantId, role }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, tenantId, role }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Invalid JSON response' }));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.token) {
      throw new Error('Token not found in response from server.');
    }

    return data.token;
  } catch (error) {
    console.error('Error fetching custom token:', error);
    throw error; // Re-throw the error so the calling component can handle it.
  }
};

export {
  getCustomToken,
};
