// Netlify Function Server Proxy for Temporary Email Providers
// Bypasses regional ISP blocks (e.g. in Egypt/MENA) by executing API requests server-side on Netlify.

const ALLOWED_ORIGINS = [
  'api.mail.gw',
  'api.mail.tm',
  'www.1secmail.com',
  'api.guerrillamail.com',
];

function isAllowedUrl(urlStr) {
  try {
    const parsed = new URL(urlStr);
    return ALLOWED_ORIGINS.some(allowed => parsed.hostname === allowed || parsed.hostname.endsWith('.' + allowed));
  } catch (e) {
    return false;
  }
}

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    let targetUrl = '';
    let method = event.httpMethod || 'GET';
    let body = event.body || null;
    let authHeader = event.headers.authorization || event.headers.Authorization || '';

    if (event.httpMethod === 'POST') {
      const parsedBody = JSON.parse(event.body || '{}');
      if (parsedBody.targetUrl) {
        targetUrl = parsedBody.targetUrl;
        method = parsedBody.method || 'GET';
        body = parsedBody.body ? JSON.stringify(parsedBody.body) : null;
        if (parsedBody.token) {
          authHeader = `Bearer ${parsedBody.token}`;
        }
      }
    }

    if (!targetUrl && event.queryStringParameters && event.queryStringParameters.url) {
      targetUrl = event.queryStringParameters.url;
    }

    if (!targetUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing targetUrl parameter' }),
      };
    }

    if (!isAllowedUrl(targetUrl)) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Access denied: domain not in proxy allowlist' }),
      };
    }

    const fetchOptions = {
      method,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    };

    if (authHeader) {
      fetchOptions.headers['Authorization'] = authHeader;
    }

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.headers['Content-Type'] = 'application/json';
      fetchOptions.body = body;
    }

    const response = await fetch(targetUrl, fetchOptions);
    const contentType = response.headers.get('content-type') || '';

    let responseData;
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const textData = await response.text();
      try {
        responseData = JSON.parse(textData);
      } catch (e) {
        responseData = { text: textData };
      }
    }

    return {
      statusCode: response.status || 200,
      headers,
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Proxy request failed', details: error.message }),
    };
  }
};
