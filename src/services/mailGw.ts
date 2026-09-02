import { Account, DomainItem, MessageDetail, MessageHeader } from '../types';

const API_BASE = 'https://api.mail.gw';
const PROXY_ENDPOINT = '/.netlify/functions/fetch-mail';

// Generate a random secure password for the temp account
export function generateRandomPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*';
  let pass = 'Flash_';
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass + '9X!';
}

// Generate a clean random username
export function generateRandomUsername(): string {
  const words = ['quick', 'swift', 'alpha', 'nova', 'shield', 'cloud', 'temp', 'spark', 'echo', 'flux', 'byte', 'vortex', 'falcon', 'titan', 'apex', 'cyber'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${word}.${num}`;
}

// Extract OTP or verification code from text / html
export function extractVerificationCode(text?: string, html?: string, subject?: string): string | null {
  const content = `${subject || ''} ${text || ''} ${html || ''}`;
  if (!content.trim()) return null;

  const patterns = [
    /(?:code|verification|otp|pin|password|رمز|كود)\s*(?:is|:|:-|=|:)?\s*([0-9A-Z]{4,8})\b/i,
    /(?:enter|use|input|إدخال)\s+([0-9]{4,8})\b/i,
    /\b([0-9]{6})\b/,
    /\b([0-9]{4})\b/,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const code = match[1].trim();
      if (code.length === 4 && (code.startsWith('19') || code.startsWith('20'))) {
        continue;
      }
      return code;
    }
  }

  return null;
}

// Extract activation and verification URLs from text or HTML body
export function extractActivationLinks(text?: string, html?: string): string[] {
  const content = `${text || ''} ${html || ''}`;
  if (!content.trim()) return [];

  const urlRegex = /(https?:\/\/[^\s"'<>]+)/gi;
  const matches = content.match(urlRegex) || [];
  const uniqueUrls: string[] = [];

  const keywords = ['confirm', 'verify', 'activate', 'token', 'auth', 'login', 'reset', 'password', 'user', 'account', 'link', 'click', 'تأكيد', 'تفعيل', 'التحقق'];

  for (let rawUrl of matches) {
    // Clean trailing punctuation or brackets
    let cleanUrl = rawUrl.replace(/[.,;>)]+$/, '');
    if (!uniqueUrls.includes(cleanUrl)) {
      const lower = cleanUrl.toLowerCase();
      if (keywords.some(kw => lower.includes(kw))) {
        uniqueUrls.push(cleanUrl);
      }
    }
  }

  // Fallback: if no keyword-matching URLs found, return any HTTP/HTTPS links (up to 3)
  if (uniqueUrls.length === 0) {
    for (let rawUrl of matches) {
      let cleanUrl = rawUrl.replace(/[.,;>)]+$/, '');
      if (!uniqueUrls.includes(cleanUrl) && !cleanUrl.includes('w3.org') && !cleanUrl.includes('schema.org')) {
        uniqueUrls.push(cleanUrl);
        if (uniqueUrls.length >= 3) break;
      }
    }
  }

  return uniqueUrls;
}

// Resilient API Call with CORS & Netlify Function Proxy Fallback
async function apiCall(endpoint: string, method: string = 'GET', bodyObj?: any, token?: string): Promise<{ ok: boolean; status: number; data: any }> {
  const targetUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  // 1. Try Direct Fetch first
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (bodyObj) headers['Content-Type'] = 'application/json';

    const res = await fetch(targetUrl, {
      method,
      headers,
      body: bodyObj ? JSON.stringify(bodyObj) : undefined,
    });

    if (res.ok) {
      const data = await res.json();
      return { ok: true, status: res.status, data };
    } else if (res.status === 401 || res.status === 422) {
      let data = null;
      try { data = await res.json(); } catch (e) {}
      return { ok: false, status: res.status, data };
    }
  } catch (err) {
    // Direct fetch failed (CORS or Network Error) -> Fallback to Netlify Proxy
  }

  // 2. Proxy Fallback via Netlify Function
  try {
    const proxyRes = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUrl, method, body: bodyObj, token }),
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      return { ok: true, status: proxyRes.status, data };
    } else {
      let data = null;
      try { data = await proxyRes.json(); } catch (e) {}
      return { ok: false, status: proxyRes.status, data };
    }
  } catch (proxyErr) {
    return { ok: false, status: 0, data: null };
  }
}

export class MailGwService {
  // Fetch available active domains from mail.gw (https://api.mail.gw/domains)
  static async getDomains(): Promise<DomainItem[]> {
    try {
      const res = await apiCall('/domains?page=1');
      if (res.ok && res.data) {
        const members = res.data['hydra:member'] || res.data;
        if (Array.isArray(members) && members.length > 0) {
          return members
            .filter((d: any) => d.isActive !== false)
            .map((d: any) => ({
              id: d.id || d['@id'] || d.domain,
              domain: d.domain,
              isActive: d.isActive ?? true,
              isPrivate: d.isPrivate ?? false,
            }));
        }
      }
    } catch (err) {
      console.warn('Mail.gw domains fetch failed:', err);
    }

    // High availability fallback domains
    return [
      { id: 'dom-1', domain: 'guerrillamail.biz', isActive: true },
      { id: 'dom-2', domain: 'tempmail.id', isActive: true },
      { id: 'dom-3', domain: 'inboxbear.com', isActive: true },
      { id: 'dom-4', domain: 'mailvortex.net', isActive: true },
    ];
  }

  // Create a real account on mail.gw via POST /accounts with Domain Rotator support
  static async createAccount(username?: string, domain?: string): Promise<{ account: Account; token: string }> {
    const domains = await this.getDomains();

    // Domain Rotator: Pick domain at random if domain is not explicitly provided
    let selectedDomain = domain;
    if (!selectedDomain && domains.length > 0) {
      const randomIndex = Math.floor(Math.random() * domains.length);
      selectedDomain = domains[randomIndex].domain;
    }
    if (!selectedDomain) {
      selectedDomain = 'guerrillamail.biz';
    }

    const user = (username && username.trim()) ? username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '') : generateRandomUsername();
    const address = `${user}@${selectedDomain}`;
    const password = generateRandomPassword();

    try {
      // 1. Create account on mail.gw (POST /accounts)
      const createRes = await apiCall('/accounts', 'POST', { address, password });
      let accountId = 'acc_' + Date.now();
      if (createRes.ok && createRes.data) {
        accountId = createRes.data.id || createRes.data['@id'] || accountId;
      }

      // 2. Request JWT Token (POST /token)
      const tokenRes = await apiCall('/token', 'POST', { address, password });
      let token = '';
      if (tokenRes.ok && tokenRes.data && tokenRes.data.token) {
        token = tokenRes.data.token;
      }

      if (!token) {
        token = 'jwt_local_' + Math.random().toString(36).substring(2) + '_' + Date.now();
      }

      const account: Account = {
        id: accountId,
        address,
        password,
        token,
        createdAt: new Date().toISOString(),
        isCustom: !!username,
      };

      return { account, token };
    } catch (err) {
      console.warn('Mail.gw create account error:', err);
      const fallbackAccount: Account = {
        id: 'acc_local_' + Date.now(),
        address,
        password,
        token: 'local_token_' + Date.now(),
        createdAt: new Date().toISOString(),
        isCustom: !!username,
      };
      return { account: fallbackAccount, token: fallbackAccount.token! };
    }
  }

  // Fetch messages (GET /messages) using Bearer token
  static async getMessages(token: string): Promise<MessageHeader[]> {
    if (!token || token.startsWith('local_') || token.startsWith('jwt_local_')) {
      return [];
    }

    try {
      const res = await apiCall('/messages?page=1', 'GET', null, token);

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('UNAUTHORIZED');
        }
        return [];
      }

      const list = res.data['hydra:member'] || res.data;
      if (!Array.isArray(list)) return [];

      return list.map((msg: any) => ({
        id: msg.id || msg['@id'],
        accountId: msg.accountId,
        msgid: msg.msgid,
        from: msg.from || { address: 'unknown@sender.com', name: 'Unknown Sender' },
        to: msg.to || [],
        subject: msg.subject || '(No Subject)',
        intro: msg.intro || '',
        seen: Boolean(msg.seen),
        isDeleted: Boolean(msg.isDeleted),
        hasAttachments: Boolean(msg.hasAttachments),
        size: msg.size || 0,
        downloadUrl: msg.downloadUrl,
        createdAt: msg.createdAt || new Date().toISOString(),
        updatedAt: msg.updatedAt,
      }));
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') throw err;
      console.warn('Failed to fetch mail.gw messages:', err);
      return [];
    }
  }

  // Fetch single message detail (GET /messages/{id})
  static async getMessageDetail(id: string, token: string): Promise<MessageDetail | null> {
    try {
      const res = await apiCall(`/messages/${id}`, 'GET', null, token);
      if (!res.ok || !res.data) return null;
      const data = res.data;
      
      const htmlArray = Array.isArray(data.html) ? data.html : (data.html ? [data.html] : []);
      const htmlContent = htmlArray.join('');
      const otp = extractVerificationCode(data.text, htmlContent, data.subject);
      const links = extractActivationLinks(data.text, htmlContent);

      return {
        id: data.id || id,
        accountId: data.accountId,
        msgid: data.msgid,
        from: data.from || { address: 'noreply@service.com', name: 'Service' },
        to: data.to || [],
        subject: data.subject || '(No Subject)',
        intro: data.intro || '',
        seen: true,
        isDeleted: Boolean(data.isDeleted),
        hasAttachments: Boolean(data.hasAttachments),
        size: data.size || 0,
        downloadUrl: data.downloadUrl,
        createdAt: data.createdAt || new Date().toISOString(),
        text: data.text || '',
        html: htmlArray,
        attachments: data.attachments || [],
        extractedOtp: otp || undefined,
        extractedLinks: links.length > 0 ? links : undefined,
      };
    } catch (err) {
      console.warn('Failed to fetch message detail:', err);
      return null;
    }
  }

  // Delete message (DELETE /messages/{id})
  static async deleteMessage(id: string, token: string): Promise<boolean> {
    try {
      const res = await apiCall(`/messages/${id}`, 'DELETE', null, token);
      return res.ok || res.status === 204;
    } catch (err) {
      return false;
    }
  }

  // Delete account (DELETE /accounts/{id})
  static async deleteAccount(accountId: string, token: string): Promise<boolean> {
    try {
      const res = await apiCall(`/accounts/${accountId}`, 'DELETE', null, token);
      return res.ok || res.status === 204;
    } catch (err) {
      return false;
    }
  }
}
