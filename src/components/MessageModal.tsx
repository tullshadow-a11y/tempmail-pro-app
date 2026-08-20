import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Calendar, 
  Mail, 
  Key, 
  Paperclip, 
  Code, 
  FileText, 
  Eye,
  ShieldCheck
} from 'lucide-react';
import { MessageDetail } from '../types';

interface MessageModalProps {
  message: MessageDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  message,
  isOpen,
  onClose,
  onDelete,
}) => {
  const [viewMode, setViewMode] = useState<'html' | 'text' | 'headers'>('html');
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !message) return null;

  const htmlContent = Array.isArray(message.html) ? message.html.join('') : (message.html || '');
  const textContent = message.text || message.intro || 'No text content available.';

  const handleCopyOtp = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleDownloadEml = () => {
    const rawContent = `From: ${message.from.name} <${message.from.address}>\nTo: ${message.to.map(t => t.address).join(', ')}\nSubject: ${message.subject}\nDate: ${message.createdAt}\n\n${textContent}`;
    const blob = new Blob([rawContent], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email_${message.id.slice(0, 8)}.eml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!message) return;
    setIsDeleting(true);
    try {
      await onDelete(message.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date
  const formattedDate = new Date(message.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Mail className="w-5 h-5" />
              </div>
              <div className="overflow-hidden text-left">
                <h3 className="font-bold text-base sm:text-lg text-white truncate">
                  {message.subject || '(No Subject)'}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                id="btn-download-eml"
                onClick={handleDownloadEml}
                title="Download EML message"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                id="btn-delete-current-message"
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete message"
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                id="btn-close-message-modal"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sender & Receiver Info Bar */}
          <div className="px-5 py-3 bg-slate-900 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 text-left">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">From:</span>
              <span className="font-semibold text-slate-200">{message.from.name || message.from.address}</span>
              <span className="text-slate-400 font-mono-code">&lt;{message.from.address}&gt;</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">To:</span>
              <span className="text-emerald-400 font-mono-code">
                {message.to[0]?.address || 'Your Temp Mail'}
              </span>
            </div>
          </div>

          {/* Extracted OTP / Verification Code Banner */}
          {message.extractedOtp && (
            <div className="mx-5 my-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-left">
                  <span className="text-xs text-emerald-300 font-bold block">
                    Verification Code (OTP) Detected:
                  </span>
                  <span className="font-mono-code font-bold text-lg sm:text-xl text-white tracking-widest">
                    {message.extractedOtp}
                  </span>
                </div>
              </div>

              <button
                id="btn-copy-otp-code"
                onClick={() => handleCopyOtp(message.extractedOtp!)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0"
              >
                {copiedOtp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedOtp ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          )}

          {/* View Modes Tabs */}
          <div className="px-5 pt-2 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('html')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                  viewMode === 'html'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>HTML View</span>
              </button>

              <button
                onClick={() => setViewMode('text')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                  viewMode === 'text'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Plain Text</span>
              </button>

              <button
                onClick={() => setViewMode('headers')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                  viewMode === 'headers'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Headers</span>
              </button>
            </div>

            {message.attachments && message.attachments.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                <Paperclip className="w-3.5 h-3.5" />
                <span>{message.attachments.length} attachments</span>
              </span>
            )}
          </div>

          {/* Email Body Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950/50 text-left">
            {viewMode === 'html' && (
              htmlContent ? (
                <div className="bg-white rounded-2xl p-4 text-slate-900 shadow-inner overflow-x-auto min-h-[250px]">
                  <div
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    className="prose max-w-none text-slate-900 text-sm leading-relaxed"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                  {textContent}
                </div>
              )
            )}

            {viewMode === 'text' && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-mono-code text-xs leading-relaxed whitespace-pre-wrap selection:bg-emerald-500 text-left">
                {textContent}
              </div>
            )}

            {viewMode === 'headers' && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-mono-code text-xs space-y-2 text-left">
                <div><strong className="text-emerald-400">Message-ID:</strong> {message.id}</div>
                <div><strong className="text-emerald-400">From:</strong> {message.from.name} &lt;{message.from.address}&gt;</div>
                <div><strong className="text-emerald-400">To:</strong> {message.to.map(t => t.address).join(', ')}</div>
                <div><strong className="text-emerald-400">Subject:</strong> {message.subject}</div>
                <div><strong className="text-emerald-400">Date:</strong> {message.createdAt}</div>
                <div><strong className="text-emerald-400">Size:</strong> {(message.size / 1024).toFixed(2)} KB</div>
              </div>
            )}

            {/* Attachments Section */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-amber-400" />
                  <span>Attachments ({message.attachments.length}):</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {message.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="truncate flex-1">
                        <span className="font-semibold text-slate-200 block truncate">{att.filename}</span>
                        <span className="text-[10px] text-slate-400">{(att.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <a
                        href={att.downloadUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 px-5 shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Encrypted content - zero telemetry stored</span>
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white px-3 py-1 rounded-lg hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
