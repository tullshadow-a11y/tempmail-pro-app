import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, QrCode as QrIcon, Smartphone } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, email }) => {
  const [copied, setCopied] = React.useState(false);

  // Quick reliable QR image from QR Server API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(email)}&margin=10&color=0f172a&bgcolor=ffffff`;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl z-10 text-center"
          >
            {/* Close button */}
            <button
              id="btn-close-qr-modal"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
              <QrIcon className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">QR Code Scanner</h3>
            <p className="text-xs text-slate-400 mb-5">
              Scan with your phone camera to copy the temporary email address directly
            </p>

            {/* QR Image Container */}
            <div className="relative mx-auto w-56 h-56 p-3 bg-white rounded-xl shadow-inner flex items-center justify-center mb-5">
              <img
                src={qrUrl}
                alt={`QR code for ${email}`}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Email Address with Copy Button */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 mb-4 text-xs font-mono-code text-emerald-400 text-left">
              <span className="truncate flex-1 font-semibold">{email}</span>
              <button
                id="btn-copy-qr-email"
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-sans text-xs transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Smartphone className="w-4 h-4 text-slate-400" />
              <span>Compatible with all smartphones & camera apps</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
