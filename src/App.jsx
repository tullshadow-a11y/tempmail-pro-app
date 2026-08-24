import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Mail,
  Copy,
  RefreshCw,
  Inbox,
  Clock,
  Trash2,
  Eye,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Globe,
  Shield,
  X
} from 'lucide-react';

// ==================== AdBanner Component ====================
const AdBanner = () => {
  const adRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById('ad-container-30830719');
    if (container && !container.hasChildNodes()) {
      try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = '//www.highperformanceformat.com/30830719/invoke.js';
        container.appendChild(script);
      } catch (e) {
        console.error("Ad loading error", e);
      }
    }
  }, []);

  return (
    <div className="w-full my-4 flex justify-center">
      <div
        id="ad-container-30830719"
        ref={adRef}
        className="min-h-[90px] w-full max-w-[728px] bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden"
      >
        <span className="text-white/20 text-xs">Advertisement</span>
      </div>
    </div>
  );
};

// ==================== Main App Component ====================
export default function App() {
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [domain, setDomain] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const intervalRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate random email
  const generateEmail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1');
      if (!res.ok) throw new Error('Failed to generate email');
      const data = await res.json();
      if (data && data.length > 0) {
        const fullEmail = data[0];
        const [user, dom] = fullEmail.split('@');
        setEmail(fullEmail);
        setLogin(user);
        setDomain(dom);
        setMessages([]);
        setSelectedMessage(null);
      }
    } catch (err) {
      setError('Failed to generate email. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch inbox messages
  const fetchMessages = useCallback(async (silent = false) => {
    if (!login || !domain) return;
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch(
        `https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`
      );
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data || []);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      if (!silent) setError('Failed to fetch messages. Will retry automatically.');
      console.error(err);
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, [login, domain]);

  // Read specific message
  const readMessage = useCallback(async (msgId) => {
    if (!login || !domain || !msgId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${msgId}`
      );
      if (!res.ok) throw new Error('Failed to read message');
      const data = await res.json();
      setSelectedMessage(data);
    } catch (err) {
      setError('Failed to read message content.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [login, domain]);

  // Initial email generation
  useEffect(() => {
    generateEmail();
  }, [generateEmail]);

  // Auto-refresh inbox every 5 seconds
  useEffect(() => {
    if (!login || !domain) return;
    fetchMessages(true);
    intervalRef.current = setInterval(() => {
      fetchMessages(true);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [login, domain, fetchMessages]);

  // Copy email to clipboard
  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  // Delete/Reset everything
  const resetInbox = () => {
    setMessages([]);
    setSelectedMessage(null);
    setLastUpdate(null);
    generateEmail();
    setShowDropdown(false);
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format relative time for last update
  const getRelativeTime = () => {
    if (!lastUpdate) return '';
    const diff = Math.floor((new Date() - lastUpdate) / 1000);
    if (diff < 5) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    return `${Math.floor(diff / 60)}m ago`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-purple-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              TempMail
            </h1>
          </div>
          <p className="text-white/50 text-sm md:text-base">
            Secure, anonymous, and disposable email addresses
          </p>
        </header>

        {/* Ad Banner Top */}
        <AdBanner />

        {/* Email Address Card */}
        <div className="mb-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                {/* Email Display */}
                <div className="flex-1 min-w-0">
                  <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1.5 block">
                    Your Temporary Email
                  </label>
                  <div className="flex items-center gap-3 bg-black/30 rounded-xl px-4 py-3 border border-white/5">
                    <Globe className="w-5 h-5 text-purple-400 shrink-0" />
                    <span className="text-lg md:text-xl font-mono text-white/90 truncate">
                      {email || 'Generating...'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={copyEmail}
                    disabled={!email}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-white/70" />
                    )}
                    <span className="hidden sm:inline text-sm font-medium">
                      {copied ? 'Copied!' : 'Copy'}
                    </span>
                  </button>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 transition-all duration-200 active:scale-95"
                    >
                      <RefreshCw className={`w-5 h-5 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
                      <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a2e] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                        <button
                          onClick={resetInbox}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                        >
                          <RefreshCw className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">Generate New Email</span>
                        </button>
                        <button
                          onClick={() => { fetchMessages(); setShowDropdown(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                        >
                          <Inbox className="w-4 h-4 text-green-400" />
                          <span className="text-sm">Refresh Inbox</span>
                        </button>
                        <div className="border-t border-white/5" />
                        <button
                          onClick={() => { setMessages([]); setSelectedMessage(null); setShowDropdown(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm">Clear Inbox</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Anonymous</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Auto-refresh: 5s</span>
                  </div>
                </div>
                {lastUpdate && (
                  <div className="flex items-center gap-1.5 text-xs text-white/30">
                    <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>Updated {getRelativeTime()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto hover:text-red-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Ad Banner Middle */}
        <AdBanner />

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Messages List */}
          <div className={`lg:col-span-2 ${selectedMessage ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-purple-400" />
                  <h2 className="font-semibold text-white/90">Inbox</h2>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
                    {messages.length}
                  </span>
                </div>
                <button
                  onClick={() => fetchMessages()}
                  disabled={refreshing}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-white/50 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Inbox className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/40 text-sm mb-1">Your inbox is empty</p>
                    <p className="text-white/20 text-xs">Waiting for incoming emails...</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {messages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => readMessage(msg.id)}
                        className={`w-full text-left px-5 py-4 transition-all duration-200 hover:bg-white/5 group ${
                          selectedMessage?.id === msg.id ? 'bg-white/10 border-l-2 border-l-purple-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <span className="text-sm font-medium text-white/90 truncate">
                            {msg.from || 'Unknown Sender'}
                          </span>
                          <span className="text-xs text-white/30 shrink-0">
                            {formatDate(msg.date)}
                          </span>
                        </div>
                        <p className="text-sm text-white/70 font-medium mb-1 truncate">
                          {msg.subject || '(No Subject)'}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/30 truncate">
                            {msg.body ? msg.body.substring(0, 60) + '...' : 'No preview available'}
                          </span>
                          <Eye className="w-3.5 h-3.5 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className={`lg:col-span-3 ${selectedMessage ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden min-h-[400px]">
              {!selectedMessage ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] px-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Mail className="w-10 h-10 text-white/20" />
                  </div>
                  <p className="text-white/40 text-lg font-medium mb-1">Select an email to read</p>
                  <p className="text-white/20 text-sm">Choose a message from your inbox</p>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Message Header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-white/70" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white/90 truncate">
                        {selectedMessage.subject || '(No Subject)'}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                        <span>From: {selectedMessage.from || 'Unknown'}</span>
                        <span>•</span>
                        <span>{formatDate(selectedMessage.date)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="hidden lg:flex p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <X className="w-5 h-5 text-white/50" />
                    </button>
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
                    {loading ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none">
                        {selectedMessage.htmlBody ? (
                          <iframe
                            srcDoc={`<style>body{color:#e5e5e5;font-family:sans-serif;line-height:1.6;padding:0;margin:0;max-width:100%;word-wrap:break-word;}a{color:#a78bfa;}img{max-width:100%;height:auto;}</style>${selectedMessage.htmlBody}`}
                            className="w-full min-h-[300px] bg-transparent border-0"
                            sandbox="allow-same-origin"
                            title="Email Content"
                          />
                        ) : selectedMessage.body ? (
                          <div className="text-white/80 whitespace-pre-wrap leading-relaxed">
                            {selectedMessage.body}
                          </div>
                        ) : selectedMessage.textBody ? (
                          <div className="text-white/80 whitespace-pre-wrap leading-relaxed">
                            {selectedMessage.textBody}
                          </div>
                        ) : (
                          <div className="text-white/30 text-center py-10">
                            No content available
                          </div>
                        )}
                      </div>
                    )}

                    {/* Attachments */}
                    {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <h4 className="text-sm font-medium text-white/60 mb-3">
                          Attachments ({selectedMessage.attachments.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMessage.attachments.map((att, idx) => (
                            <a
                              key={idx}
                              href={`https://www.1secmail.com/api/v1/?action=download&login=${login}&domain=${domain}&id=${selectedMessage.id}&file=${att.filename}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm text-purple-300"
                            >
                              <span className="truncate max-w-[200px]">{att.filename}</span>
                              <span className="text-white/30 text-xs">({Math.round(att.size / 1024)} KB)</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ad Banner Bottom */}
        <AdBanner />

        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-white/20 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>All emails are automatically deleted after a short period of time</span>
          </div>
        </footer>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
