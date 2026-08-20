import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Eye, 
  Tag, 
  ArrowLeft, 
  Share2, 
  MessageSquare, 
  Calendar,
  Check
} from 'lucide-react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  posts: BlogPost[];
  selectedPostSlug?: string | null;
  onSelectPost: (slug: string) => void;
  onBackToList: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  posts,
  selectedPostSlug,
  onSelectPost,
  onBackToList,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedLink, setCopiedLink] = useState(false);
  const [comments, setComments] = useState<Array<{ name: string; text: string; time: string }>>([
    { name: 'Michael Reed', text: 'Extremely helpful article! Using disposable email saved my personal mailbox from endless marketing spam.', time: '2 days ago' },
    { name: 'David K.', text: 'Great breakdown on QA testing workflows. Was looking for a reliable setup for local staging.', time: '4 days ago' },
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = posts.filter((p) => {
    if (!p.published) return false;
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const currentPost = posts.find(p => p.slug === selectedPostSlug);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;
    setComments([
      ...comments,
      {
        name: newCommentName.trim(),
        text: newCommentText.trim(),
        time: 'Just now',
      },
    ]);
    setNewCommentName('');
    setNewCommentText('');
  };

  // If a single post is selected
  if (currentPost) {
    const relatedPosts = posts.filter(p => p.id !== currentPost.id && p.published).slice(0, 2);

    return (
      <div className="w-full max-w-4xl mx-auto my-8 px-4 sm:px-6">
        {/* Back Button */}
        <button
          onClick={onBackToList}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white mb-6 p-2 rounded-xl hover:bg-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>

        {/* Post Container */}
        <article className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-6 sm:p-10 mb-10 text-left">
          {/* Post Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                {currentPost.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {currentPost.readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              {currentPost.title}
            </h1>

            {/* Author info & stats */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <img
                  src={currentPost.author.avatar}
                  alt={currentPost.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{currentPost.author.name}</h4>
                  <span className="text-slate-400">{currentPost.author.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  {new Date(currentPost.createdAt).toLocaleDateString('en-US')}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-slate-500" />
                  {currentPost.views} reads
                </span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {currentPost.coverImage && (
            <div className="rounded-2xl overflow-hidden mb-8 max-h-96 border border-slate-800">
              <img
                src={currentPost.coverImage}
                alt={currentPost.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Content Body */}
          <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-sans">
            {currentPost.content}
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-emerald-400" /> Tags:
            </span>
            {currentPost.tags.map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold">
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Comments Section */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 mb-10 shadow-xl text-left">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span>Discussion & Comments ({comments.length})</span>
          </h3>

          {/* Comment list */}
          <div className="space-y-4 mb-8">
            {comments.map((c, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      {c.name.charAt(0)}
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-200">{c.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{c.time}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 pl-9 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300">Add a Comment:</h4>
            <input
              type="text"
              required
              placeholder="Your name..."
              value={newCommentName}
              onChange={(e) => setNewCommentName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <textarea
              required
              rows={3}
              placeholder="Write your comment or question..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              Post Comment
            </button>
          </form>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="text-left">
            <h3 className="text-lg font-bold text-white mb-4">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post.slug)}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
                >
                  <span className="text-[11px] text-emerald-400 font-bold block mb-1">{post.category}</span>
                  <h4 className="text-sm font-bold text-white line-clamp-2 mb-2">{post.title}</h4>
                  <span className="text-xs text-slate-400">{post.readTime}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Articles List View
  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
          <BookOpen className="w-4 h-4" />
          <span>Knowledge Center & Tech Blog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
          Latest Articles in Security & Privacy
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Comprehensive guides on protecting your personal data, combating spam, and getting the most from disposable mail.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search articles & tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ y: -5 }}
            onClick={() => onSelectPost(post.slug)}
            className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl hover:border-emerald-500/40 cursor-pointer flex flex-col justify-between transition-all group"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[11px] font-bold border border-slate-800">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Post Card Footer */}
            <div className="p-5 pt-0 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 mt-auto">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="font-semibold text-slate-300">{post.author.name}</span>
              </div>
              <span className="font-mono text-slate-500">{post.readTime}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
