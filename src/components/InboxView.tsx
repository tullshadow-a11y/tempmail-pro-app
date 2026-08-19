import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Inbox, 
  Mail, 
  MailOpen, 
  Search, 
  Trash2, 
  RefreshCw, 
  Key, 
  Paperclip, 
  Sparkles
} from 'lucide-react';
import { MessageDetail, MessageHeader } from '../types';

interface InboxViewProps {
  messages: (MessageHeader | MessageDetail)[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onSelectMessage: (id: string) => void;
  onDeleteMessage: (id: string, e: React.MouseEvent) => void;
  onDeleteAllMessages: () => void;
  onSendTestEmail: (templateKey?: string) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  messages,
  isLoading,
  isRefreshing,
  onRefresh,
  onSelectMessage,
  onDeleteMessage,
  onDeleteAllMessages,
  onSendTestEmail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'otp' | 'attachments'>('all');
  const [showTestMenu, setShowTestMenu] = useState(false);

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      msg.subject.toLowerCase().includes(query) ||
      msg.from.name.toLowerCase().includes(query) ||
      msg.from.address.toLowerCase().includes(query) ||
      (msg.intro && msg.intro.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    if (activeFilter === 'unread') return !msg.seen;
    if (activeFilter === 'attachments') return msg.hasAttachments;
    if (activeFilter === 'otp') {
      const detail = msg as MessageDetail;
      return Boolean(detail.extractedOtp || msg.subject.includes('OTP') || msg.subject.includes('Code') || msg.subject.includes('Verification') || msg.subject.includes('PIN'));
    }
    return true;
  });

  const unreadCount = messages.filter(m => !m.seen).length;

  const testTemplates = [
    { key: 'telegram', name: 'Telegram Login Code', code: '489-102', icon: '✈️' },
    { key: 'netflix', name: 'Netflix Activation PIN', code: '729410', icon: '🎬' },
    { key: 'google', name: 'Google Security Alert', code: 'G-839201', icon: '🔒' },
    { key: 'discord', name: 'Discord Verify Email', code: '503921', icon: '🎮' },
    { key: 'github', name: 'GitHub One-Time Password', code: '918234', icon: '🐙' },
  ];

  return (
    <div id="inbox-section" className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Inbox Top Bar */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Live Inbox</h3>
                {messages.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                  </span>
                )}
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Messages refresh automatically in real-time
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Test email generator button */}
            <div className="relative">
              <button
                id="btn-trigger-test-email"
                onClick={() => setShowTestMenu(!showTestMenu)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all"
                title="Send a sample email to test the inbox"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Send Test Email</span>
              </button>

              {showTestMenu && (
                <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-30">
                  <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 border-b border-slate-800 mb-1">
                    Select Test Email Template:
                  </div>
                  {testTemplates.map((tpl) => (
                    <button
                      key={tpl.key}
                      onClick={() => {
                        onSendTestEmail(tpl.key);
                        setShowTestMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 hover:text-emerald-400 flex items-center justify-between transition-colors"
                    >
                      <span className="truncate">{tpl.icon} {tpl.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{tpl.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {messages.length > 0 && (
              <button
                id="btn-delete-all-inbox"
                onClick={onDeleteAllMessages}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700/60 transition-colors"
                title="Clear all messages"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              id="btn-refresh-inbox-header"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title="Refresh manually"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        {messages.length > 0 && (
          <div className="p-3 sm:px-6 bg-slate-900 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({messages.length})
              </button>

              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeFilter === 'unread'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Unread ({unreadCount})
              </button>

              <button
                onClick={() => setActiveFilter('otp')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeFilter === 'otp'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Key className="w-3 h-3" />
                <span>OTP Codes</span>
              </button>

              <button
                onClick={() => setActiveFilter('attachments')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeFilter === 'attachments'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Paperclip className="w-3 h-3" />
                <span>Attachments</span>
              </button>
            </div>
          </div>
        )}

        {/* Message List or Empty State */}
        <div className="min-h-[280px] divide-y divide-slate-800/80">
          {isLoading && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-300">Connecting to mailbox...</p>
            </div>
          ) : filteredMessages.length > 0 ? (
            <AnimatePresence>
              {filteredMessages.map((msg) => {
                const detail = msg as MessageDetail;
                const otp = detail.extractedOtp;
                const timeString = new Date(msg.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => onSelectMessage(msg.id)}
                    className={`p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition-all hover:bg-slate-800/60 group ${
                      !msg.seen ? 'bg-slate-850/60 border-l-4 border-emerald-500' : 'bg-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Avatar / Icon */}
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                        !msg.seen
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {!msg.seen ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 truncate">
                            <span className={`text-sm truncate ${!msg.seen ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                              {msg.from.name || msg.from.address}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline truncate">
                              &lt;{msg.from.address}&gt;
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {msg.hasAttachments && (
                              <Paperclip className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            <span className="text-[11px] text-slate-400 font-mono">
                              {timeString}
                            </span>
                          </div>
                        </div>

                        <h4 className={`text-xs sm:text-sm truncate mb-1 ${!msg.seen ? 'font-semibold text-emerald-300' : 'text-slate-300'}`}>
                          {msg.subject || '(No Subject)'}
                        </h4>

                        <p className="text-xs text-slate-400 line-clamp-1">
                          {msg.intro || 'Click to view full email content...'}
                        </p>

                        {/* Extracted OTP Badge in Inbox Card */}
                        {otp && (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                            <Key className="w-3 h-3" />
                            <span>Verification Code:</span>
                            <span className="text-white bg-slate-900 px-1.5 py-0.5 rounded tracking-wider">{otp}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delete Message Button */}
                    <button
                      onClick={(e) => onDeleteMessage(msg.id, e)}
                      title="Delete message"
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-700/80 transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            /* Animated Empty State / Scanner radar */
            <div className="py-14 px-4 flex flex-col items-center justify-center text-center">
              {/* Radar pulse animation */}
              <div className="relative mb-5 flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full bg-emerald-500/10 animate-ping" />
                <div className="absolute w-16 h-16 rounded-full bg-emerald-500/20 animate-pulse" />
                <div className="relative w-12 h-12 rounded-2xl bg-slate-800 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl">
                  <Mail className="w-6 h-6" />
                </div>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-white mb-1.5">
                Your inbox is currently empty
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                Waiting for incoming emails... Messages and activation codes will appear here automatically as soon as they arrive.
              </p>

              {/* Instant Test Button */}
              <button
                id="btn-send-sample-email"
                onClick={() => onSendTestEmail()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Send Instant Test Email</span>
              </button>
            </div>
          )}
        </div>

        {/* Inbox Bottom Bar */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 px-4 sm:px-6">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Server Status: Connected & Operational</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
