import { Account, DomainItem, MessageDetail, MessageHeader } from '../types';

const MAIL_GW_BASE = 'https://api.mail.gw';
const MAIL_TM_BASE = 'https://api.mail.tm';
const GUERRILLA_BASE = 'https://api.guerrillamail.com/ajax.php';
const ONESEC_BASE = 'https://www.1secmail.com/api/v1/';
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
];

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
  // 1. Fetch available domains across all providers
  static async getDomains(): Promise<DomainItem[]> {
    const domains: DomainItem[] = [];

    // Try Mail.gw
    try {
      const res = await fetch(`${MAIL_GW_BASE}/domains?page=1`, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        const members = data['hydra:member'] || data;
        if (Array.isArray(members)) {
          members.forEach((d: any) => {
            if (d.domain && d.isActive !== false) {
              domains.push({ id: `gw-${d.id || d.domain}`, domain: d.domain, isActive: true });
            }
          });
        }
      }
    } catch (e) {
      // Continue to next provider
    }

    // Try Mail.tm
    try {
      const res = await fetch(`${MAIL_TM_BASE}/domains?page=1`, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        const members = data['hydra:member'] || data;
        if (Array.isArray(members)) {
          members.forEach((d: any) => {
            if (d.domain && !domains.some(existing => existing.domain === d.domain)) {
              domains.push({ id: `tm-${d.id || d.domain}`, domain: d.domain, isActive: true });
            }
          });
        }
      }
    } catch (e) {
      // Continue to next provider
    }

    // 1SecMail standard domains
    const oneSecDomains = ['1secmail.com', '1secmail.org', '1secmail.net', 'esi2.com', 'wwm2.com', 'vti2.com'];
    oneSecDomains.forEach(dom => {
      if (!domains.some(d => d.domain === dom)) {
        domains.push({ id: `1sec-${dom}`, domain: dom, isActive: true });
      }
    });

    if (domains.length > 0) return domains;

    // Hardcoded fallback list if all fails
    return [
      { id: 'dom-1', domain: 'guerrillamail.biz', isActive: true },
      { id: 'dom-2', domain: 'tempmail.id', isActive: true },
      { id: 'dom-3', domain: 'inboxbear.com', isActive: true },
      { id: 'dom-4', domain: '1secmail.com', isActive: true },
    ];
  }

  // 2. Create account using best available provider
  static async createAccount(username?: string, domain?: string): Promise<{ account: Account; token: string }> {
    const domains = await this.getDomains();
    const selectedDomain = domain || (domains.length > 0 ? domains[0].domain : '1secmail.com');
    const user = (username && username.trim()) ? username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '') : generateRandomUsername();
    const address = `${user}@${selectedDomain}`;
    const password = generateRandomPassword();

    // Provider 1: Mail.gw / Mail.tm API
    try {
      const apiEndpoint = selectedDomain.includes('mail.tm') ? MAIL_TM_BASE : MAIL_GW_BASE;
      const createRes = await fetch(`${apiEndpoint}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ address, password }),
      });

      let accountId = 'acc_' + Date.now();
      if (createRes.ok) {
        const createData = await createRes.json();
        accountId = createData.id || createData['@id'] || accountId;
      }

      const tokenRes = await fetch(`${apiEndpoint}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ address, password }),
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        const token = tokenData.token;
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
    } catch (err) {
      // Fallback
    }

    // Provider 2: 1SecMail or GuerrillaMail fallback
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

  // 3. Fetch messages using token / provider routing
  static async getMessages(token: string): Promise<MessageHeader[]> {
    if (!token) return [];

    // Case A: Mail.gw / Mail.tm
    if (token.startsWith('gw_tm:')) {
      const realToken = token.replace('gw_tm:', '');
      try {
        const res = await fetch(`${MAIL_GW_BASE}/messages?page=1`, {
          headers: { 'Authorization': `Bearer ${realToken}`, 'Accept': 'application/json' },
        });

        if (res.ok) {
          const data = await res.json();
          const list = data['hydra:member'] || data;
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
      } catch (e) {
        // Fallback
      }
    }

    // Case B: 1SecMail API (Direct & Proxied)
    if (token.startsWith('onesec:')) {
      const [, user, domain] = token.split(':');
      const fetchUrls = [
        `${ONESEC_BASE}?action=getMessages&login=${user}&domain=${domain}`,
        `${CORS_PROXIES[0]}${encodeURIComponent(`${ONESEC_BASE}?action=getMessages&login=${user}&domain=${domain}`)}`,
      ];

      for (const url of fetchUrls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const list = await res.json();
            if (Array.isArray(list)) {
              return list.map((msg: any) => ({
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
        } catch (e) {
          // Next proxy
        }
      }
    }

    return [];
  }

  // 4. Fetch message detail
  static async getMessageDetail(id: string, token: string): Promise<MessageDetail | null> {
    if (id.startsWith('gw_') && token.startsWith('gw_tm:')) {
      const realId = id.replace('gw_', '');
      const realToken = token.replace('gw_tm:', '');
      try {
        const res = await fetch(`${MAIL_GW_BASE}/messages/${realId}`, {
          headers: { 'Authorization': `Bearer ${realToken}`, 'Accept': 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
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
      } catch (e) {
        // Fallback
      }
    }

    if (id.startsWith('onesec_') && token.startsWith('onesec:')) {
      const realId = id.replace('onesec_', '');
      const [, user, domain] = token.split(':');
      const fetchUrls = [
        `${ONESEC_BASE}?action=readMessage&login=${user}&domain=${domain}&id=${realId}`,
        `${CORS_PROXIES[0]}${encodeURIComponent(`${ONESEC_BASE}?action=readMessage&login=${user}&domain=${domain}&id=${realId}`)}`,
      ];

      for (const url of fetchUrls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
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
        } catch (e) {
          // Next proxy
        }
      }
    }

    return null;
  }

  // Delete message
  static async deleteMessage(id: string, token: string): Promise<boolean> {
    if (id.startsWith('gw_') && token.startsWith('gw_tm:')) {
      const realId = id.replace('gw_', '');
      const realToken = token.replace('gw_tm:', '');
      try {
        const res = await fetch(`${MAIL_GW_BASE}/messages/${realId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${realToken}` },
        });
        return res.ok || res.status === 204;
      } catch (e) {
        return false;
      }
    }
    return true;
  }

  // Delete account
  static async deleteAccount(accountId: string, token: string): Promise<boolean> {
    if (token.startsWith('gw_tm:')) {
      const realToken = token.replace('gw_tm:', '');
      try {
        const res = await fetch(`${MAIL_GW_BASE}/accounts/${accountId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${realToken}` },
        });
        return res.ok || res.status === 204;
      } catch (e) {
        return false;
      }
    }
    return true;
  }
}

// Backwards compatibility alias
export const MailGwService = MultiMailService;
