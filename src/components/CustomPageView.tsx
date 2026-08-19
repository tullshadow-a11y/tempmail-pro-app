import React from 'react';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { CustomPage } from '../types';

interface CustomPageViewProps {
  page: CustomPage;
  onBackToHome: () => void;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({ page, onBackToHome }) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4 sm:px-6">
      {/* Back Button */}
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white mb-6 p-2 rounded-xl hover:bg-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden text-left">
        <div className="flex items-center gap-2.5 mb-3 text-emerald-400">
          <FileText className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Official Page</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
          {page.title}
        </h1>

        <div className="flex items-center gap-2 text-xs text-slate-400 pb-6 mb-6 border-b border-slate-800">
          <Calendar className="w-3.5 h-3.5" />
          <span>Last updated: {new Date(page.updatedAt || page.createdAt).toLocaleDateString('en-US')}</span>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-sans">
          {page.content}
        </div>
      </div>
    </div>
  );
};
