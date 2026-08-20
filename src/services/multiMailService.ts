import { Account, DomainItem, MessageDetail, MessageHeader } from '../types';

const MAIL_GW_BASE = 'https://api.mail.gw';
const MAIL_TM_BASE = 'https://api.mail.tm';
const ONESEC_BASE = 'https://www.1secmail.com/api/v1/';
const GUERRILLA_BASE = 'https://api.guerrillamail.com/ajax.php';
const PROXY_ENDPOINT = '/.netlify/functions/fetch-mail';

async function proxyFetch(targetUrl: string, method: string = 'GET', body?: any, token?: string): Promise<any> {
  // First try via Netlify server-side function proxy
  try {
    const response = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUrl, method, body, token }),
    });

    if (response.ok) {
      const data = await response.json();
      return { ok: true, data };
    }
  } catch (err) {
    // Proxy unavailable, fallback to direct fetch
  }

  // Fallback direct request
  try {
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (body) headers['Content-Type'] = 'application/json';

    const directRes = await fetch(targetUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (directRes.ok) {
      const data = await directRes.json();
      return { ok: true, data };
    }
  } catch (e) {
    // Both failed
  }

  return { ok: false, data: null };
}

export function generateRandomPassword(): string {
  return 'Temp_' + Math.random().toString(36).substring(2, 10) + '!9X';
}

export function generateRandomUsername(): string {
  const words = ['quick', 'swift', 'alpha', 'nova', 'shield', 'cloud', 'temp', 'spark', 'echo', 'flux', 'byte', 'vortex', 'falcon', 'titan', 'apex', 'cyber'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${word}.${num}`;
}

export function extractVerificationCode(text?: string, html?: string): string | null {
  const content = (text || '') + ' ' + (html || '');
  if (!content.trim()) return null;

  const patterns = [
    /(?:code|verification|otp|pin|password)\s*(?:is|:|:-|=|:)?\s*([0-9A-Z]{4,8})\b/i,
    /(?:enter|use|input)\s+([0-9]{4,8})\b/i,
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

export class MultiMailService {
  // 1. Fetch available domains
  static async getDomains(): Promise<DomainItem[]> {
    const domains: DomainItem[] = [];

    // Try Mail.gw via proxy
    const gwRes = await proxyFetch(`${MAIL_GW_BASE}/domains?page=1`);
    if (gwRes.ok && gwRes.data) {
      const members = gwRes.data['hydra:member'] || gwRes.data;
      if (Array.isArray(members)) {
        members.forEach((d: any) => {
          if (d.domain && d.isActive !== false) {
            domains.push({ id: `gw-${d.id || d.domain}`, domain: d.domain, isActive: true });
          }
        });
      }
    }

    // Try Mail.tm via proxy
    const tmRes = await proxyFetch(`${MAIL_TM_BASE}/domains?page=1`);
    if (tmRes.ok && tmRes.data) {
      const members = tmRes.data['hydra:member'] || tmRes.data;
      if (Array.isArray(members)) {
        members.forEach((d: any) => {
          if (d.domain && !domains.some(existing => existing.domain === d.domain)) {
            domains.push({ id: `tm-${d.id || d.domain}`, domain: d.domain, isActive: true });
          }
        });
      }
    }

    // 1SecMail standard domains
    const oneSecDomains = ['1secmail.com', '1secmail.org', '1secmail.net', 'esi2.com', 'wwm2.com', 'vti2.com'];
    oneSecDomains.forEach(dom => {
      if (!domains.some(d => d.domain === dom)) {
        domains.push({ id: `1sec-${dom}`, domain: dom, isActive: true });
      }
    });

    // GuerrillaMail domain
    if (!domains.some(d => d.domain === 'sharklasers.com')) {
      domains.push({ id: 'guerrilla-sharklasers.com', domain: 'sharklasers.com', isActive: true });
    }

    if (domains.length > 0) return domains;

    return [
      { id: 'dom-1', domain: 'sharklasers.com', isActive: true },
      { id: 'dom-2', domain: 'guerrillamail.biz', isActive: true },
      { id: 'dom-3', domain: '1secmail.com', isActive: true },
    ];
  }

  // 2. Create account
  static async createAccount(username?: string, domain?: string): Promise<{ account: Account; token: string }> {
    const domains = await this.getDomains();
    const selectedDomain = domain || (domains.length > 0 ? domains[0].domain : '1secmail.com');
    const user = (username && username.trim()) ? username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '') : generateRandomUsername();
    const address = `${user}@${selectedDomain}`;
    const password = generateRandomPassword();

    // Provider GuerrillaMail
    if (selectedDomain.includes('sharklasers') || selectedDomain.includes('guerrillamail')) {
      const gRes = await proxyFetch(`${GUERRILLA_BASE}?f=get_email_address&lang=en`);
      if (gRes.ok && gRes.data && gRes.data.sid_token) {
        const sid = gRes.data.sid_token;
        const gAddress = gRes.data.email_addr || address;
        const account: Account = {
          id: 'acc_guerrilla_' + Date.now(),
          address: gAddress,
          password,
          token: `guerrilla:${sid}:${gAddress}`,
          createdAt: new Date().toISOString(),
          isCustom: !!username,
        };
        return { account, token: account.token! };
      }
    }

    // Provider 1: Mail.gw / Mail.tm API
    const apiEndpoint = selectedDomain.includes('mail.tm') ? MAIL_TM_BASE : MAIL_GW_BASE;
    const createRes = await proxyFetch(`${apiEndpoint}/accounts`, 'POST', { address, password });

    let accountId = 'acc_' + Date.now();
    if (createRes.ok && createRes.data) {
      accountId = createRes.data.id || createRes.data['@id'] || accountId;
    }

    const tokenRes = await proxyFetch(`${apiEndpoint}/token`, 'POST', { address, password });
    if (tokenRes.ok && tokenRes.data && tokenRes.data.token) {
      const token = tokenRes.data.token;
      const account: Account = {
        id: accountId,
        address,
        password,
        token: `gw_tm:${token}`,
        createdAt: new Date().toISOString(),
        isCustom: !!username,
      };
      return { account, token: account.token! };
    }

    // Provider 2: 1SecMail fallback
    const fallbackToken = `onesec:${user}:${selectedDomain}`;
    const account: Account = {
      id: 'acc_multi_' + Date.now(),
      address,
      password,
      token: fallbackToken,
      createdAt: new Date().toISOString(),
      isCustom: !!username,
    };

    return { account, token: fallbackToken };
  }

  // 3. Fetch messages
  static async getMessages(token: string): Promise<MessageHeader[]> {
    if (!token) return [];

    // GuerrillaMail
    if (token.startsWith('guerrilla:')) {
      const [, sid, gAddress] = token.split(':');
      const targetUrl = `${GUERRILLA_BASE}?f=get_email_list&offset=0&sid_token=${sid}`;
      const res = await proxyFetch(targetUrl);
      if (res.ok && res.data && Array.isArray(res.data.list)) {
        return res.data.list.map((msg: any) => ({
          id: `guerrilla_${msg.mail_id}`,
          from: { address: msg.mail_from || 'unknown@sender.com', name: msg.mail_from ? msg.mail_from.split('@')[0] : 'Sender' },
          to: [{ address: gAddress || '', name: '' }],
          subject: msg.mail_subject || '(No Subject)',
          intro: msg.mail_excerpt || '',
          seen: Boolean(msg.mail_read),
          isDeleted: false,
          hasAttachments: false,
          size: parseInt(msg.mail_size || '1024', 10),
          createdAt: msg.mail_date || new Date().toISOString(),
        }));
      }
    }

    // Mail.gw / Mail.tm
    if (token.startsWith('gw_tm:')) {
      const realToken = token.replace('gw_tm:', '');
      const res = await proxyFetch(`${MAIL_GW_BASE}/messages?page=1`, 'GET', null, realToken);
      if (res.ok && res.data) {
        const list = res.data['hydra:member'] || res.data;
        if (Array.isArray(list)) {
          return list.map((msg: any) => ({
            id: `gw_${msg.id || msg['@id']}`,
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
            createdAt: msg.createdAt || new Date().toISOString(),
          }));
        }
      }
    }

    // 1SecMail
    if (token.startsWith('onesec:')) {
      const [, user, domain] = token.split(':');
      const targetUrl = `${ONESEC_BASE}?action=getMessages&login=${user}&domain=${domain}`;
      const res = await proxyFetch(targetUrl);
      if (res.ok && Array.isArray(res.data)) {
        return res.data.map((msg: any) => ({
          id: `onesec_${msg.id}`,
          from: { address: msg.from, name: msg.from.split('@')[0] },
          to: [{ address: `${user}@${domain}`, name: user }],
          subject: msg.subject || '(No Subject)',
          intro: msg.subject || '',
          seen: false,
          isDeleted: false,
          hasAttachments: false,
          size: 1024,
          createdAt: msg.date || new Date().toISOString(),
        }));
      }
    }

    return [];
  }

  // 4. Fetch message detail
  static async getMessageDetail(id: string, token: string): Promise<MessageDetail | null> {
    if (id.startsWith('guerrilla_') && token.startsWith('guerrilla:')) {
      const realId = id.replace('guerrilla_', '');
      const [, sid, gAddress] = token.split(':');
      const targetUrl = `${GUERRILLA_BASE}?f=fetch_email&email_id=${realId}&sid_token=${sid}`;
      const res = await proxyFetch(targetUrl);
      if (res.ok && res.data) {
        const data = res.data;
        const text = data.mail_body || '';
        const htmlArray = [text];
        const otp = extractVerificationCode(text, text);

        return {
          id,
          from: { address: data.mail_from || 'unknown@sender.com', name: data.mail_from ? data.mail_from.split('@')[0] : 'Sender' },
          to: [{ address: gAddress || '', name: '' }],
          subject: data.mail_subject || '(No Subject)',
          intro: data.mail_excerpt || '',
          seen: true,
          isDeleted: false,
          hasAttachments: false,
          size: parseInt(data.mail_size || '1024', 10),
          createdAt: data.mail_date || new Date().toISOString(),
          text,
          html: htmlArray,
          extractedOtp: otp || undefined,
        };
      }
    }

    if (id.startsWith('gw_') && token.startsWith('gw_tm:')) {
      const realId = id.replace('gw_', '');
      const realToken = token.replace('gw_tm:', '');
      const res = await proxyFetch(`${MAIL_GW_BASE}/messages/${realId}`, 'GET', null, realToken);
      if (res.ok && res.data) {
        const data = res.data;
        const htmlArray = Array.isArray(data.html) ? data.html : (data.html ? [data.html] : []);
        const htmlContent = htmlArray.join('');
        const otp = extractVerificationCode(data.text, htmlContent);

        return {
          id,
          accountId: data.accountId,
          from: data.from || { address: 'noreply@service.com', name: 'Service' },
          to: data.to || [],
          subject: data.subject || '(No Subject)',
          intro: data.intro || '',
          seen: true,
          isDeleted: Boolean(data.isDeleted),
          hasAttachments: Boolean(data.hasAttachments),
          size: data.size || 0,
          createdAt: data.createdAt || new Date().toISOString(),
          text: data.text || '',
          html: htmlArray,
          attachments: data.attachments || [],
          extractedOtp: otp || undefined,
        };
      }
    }

    if (id.startsWith('onesec_') && token.startsWith('onesec:')) {
      const realId = id.replace('onesec_', '');
      const [, user, domain] = token.split(':');
      const targetUrl = `${ONESEC_BASE}?action=readMessage&login=${user}&domain=${domain}&id=${realId}`;
      const res = await proxyFetch(targetUrl);
      if (res.ok && res.data) {
        const data = res.data;
        const text = data.textBody || data.body || '';
        const htmlArray = data.htmlBody ? [data.htmlBody] : [];
        const otp = extractVerificationCode(text, data.htmlBody);

        return {
          id,
          from: { address: data.from, name: data.from.split('@')[0] },
          to: [{ address: `${user}@${domain}`, name: user }],
          subject: data.subject || '(No Subject)',
          intro: data.subject || '',
          seen: true,
          isDeleted: false,
          hasAttachments: Boolean(data.attachments && data.attachments.length > 0),
          size: 2048,
          createdAt: data.date || new Date().toISOString(),
          text,
          html: htmlArray,
          extractedOtp: otp || undefined,
        };
      }
    }

    return null;
  }

  // Delete message
  static async deleteMessage(id: string, token: string): Promise<boolean> {
    if (id.startsWith('gw_') && token.startsWith('gw_tm:')) {
      const realId = id.replace('gw_', '');
      const realToken = token.replace('gw_tm:', '');
      const res = await proxyFetch(`${MAIL_GW_BASE}/messages/${realId}`, 'DELETE', null, realToken);
      return res.ok;
    }
    return true;
  }

  // Delete account
  static async deleteAccount(accountId: string, token: string): Promise<boolean> {
    if (token.startsWith('gw_tm:')) {
      const realToken = token.replace('gw_tm:', '');
      const res = await proxyFetch(`${MAIL_GW_BASE}/accounts/${accountId}`, 'DELETE', null, realToken);
      return res.ok;
    }
    return true;
  }
}

export const MailGwService = MultiMailService;
