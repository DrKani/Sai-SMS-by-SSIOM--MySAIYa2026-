import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, Tag, MessageCircle, Send, ChevronRight,
  AlertCircle, Loader2, BookOpen, User, Calendar, CheckCircle,
  Search, Filter, Sparkles
} from 'lucide-react';
import {
  collection, getDocs, query, where, orderBy, addDoc,
  doc, getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article, ArticleComment, UserProfile } from '../types';
import SaiAvatar from '../components/SaiAvatar';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-MY', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

const StatusBadge = ({ status }: { status: 'pending' | 'approved' | 'rejected' }) => {
  const map = {
    pending: 'bg-gold-100 text-gold-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${map[status]}`}>
      {status}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Article Card (list view)
// ---------------------------------------------------------------------------
const ArticleCard = ({ article, onClick }: { article: Article; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-white rounded-3xl border border-navy-50 shadow-sm hover:shadow-xl hover:border-gold-300 transition-all group overflow-hidden"
  >
    {article.imageUrl && (
      <div className="h-48 overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
    )}
    <div className="p-6 space-y-3">
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-[9px] font-black uppercase tracking-widest">
              <Tag size={9} /> {tag}
            </span>
          ))}
        </div>
      )}
      <h3 className="text-lg font-serif font-bold text-navy-900 leading-snug group-hover:text-gold-700 transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-sm text-navy-500 leading-relaxed line-clamp-3">{article.excerpt}</p>
      <div className="flex items-center justify-between pt-2 border-t border-navy-50">
        <div className="flex items-center gap-2 text-[10px] text-navy-400 font-bold">
          <User size={12} />
          <span>{article.author}</span>
          <span className="text-navy-200">•</span>
          <Calendar size={12} />
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        {article.commentsEnabled && (
          <div className="flex items-center gap-1 text-[10px] text-navy-400">
            <MessageCircle size={12} />
            <span>Comments</span>
          </div>
        )}
        <ChevronRight size={16} className="text-gold-500 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </button>
);

// ---------------------------------------------------------------------------
// Comment Item
// ---------------------------------------------------------------------------
const CommentItem = ({ comment }: { comment: ArticleComment }) => (
  <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
    <div className="shrink-0">
      <SaiAvatar gender="male" size={36} />
    </div>
    <div className="flex-grow">
      <div className="bg-neutral-50 rounded-2xl rounded-tl-none p-4 border border-navy-50">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-navy-900 text-sm">{comment.userName}</span>
          <span className="text-[10px] text-navy-400">{formatDate(comment.timestamp)}</span>
        </div>
        <p className="text-sm text-navy-700 leading-relaxed">{comment.content}</p>
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Article Detail View
// ---------------------------------------------------------------------------
const ArticleDetail = ({ articleId, user }: { articleId: string; user: UserProfile | null }) => {
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'articles', articleId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists() || (docSnap.data() as Article).status !== 'published') {
        setError('Article not found.');
        return;
      }
      setArticle({ id: docSnap.id, ...docSnap.data() } as Article);

      // Load approved comments
      const commentsSnap = await getDocs(
        query(
          collection(db, 'articleComments'),
          where('articleId', '==', articleId),
          where('status', '==', 'approved'),
          orderBy('timestamp', 'asc')
        )
      );
      setComments(commentsSnap.docs.map(d => ({ id: d.id, ...d.data() } as ArticleComment)));
    } catch (err: any) {
      console.error('Failed to load article:', err);
      setError('Could not load this article. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => { loadArticle(); }, [loadArticle]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.isGuest || !commentText.trim() || !article) return;
    setIsSubmitting(true);
    try {
      const newComment: Omit<ArticleComment, 'id'> = {
        articleId,
        uid: user.uid,
        userName: user.name,
        content: commentText.trim(),
        timestamp: new Date().toISOString(),
        status: 'pending',
      };
      await addDoc(collection(db, 'articleComments'), newComment);
      setCommentText('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit comment:', err);
      alert('Could not post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="text-gold-500 animate-spin" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
        <p className="text-navy-600 font-bold mb-4">{error || 'Article not found.'}</p>
        <button
          onClick={() => navigate('/articles')}
          className="px-6 py-3 bg-navy-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest"
        >
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-12">
      {/* Back nav */}
      <button
        onClick={() => navigate('/articles')}
        className="flex items-center gap-2 text-navy-400 hover:text-navy-900 transition-colors text-sm font-bold"
      >
        <ArrowLeft size={16} /> All Articles
      </button>

      {/* Hero */}
      <article>
        {article.imageUrl && (
          <div className="rounded-3xl overflow-hidden mb-8 h-64 md:h-80">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 leading-snug mb-4">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-navy-400 font-medium mb-8 pb-8 border-b border-navy-50">
          <div className="flex items-center gap-2">
            <User size={14} />
            <span className="font-bold text-navy-700">{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          {article.commentsEnabled && (
            <div className="flex items-center gap-2">
              <MessageCircle size={14} />
              <span>{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="prose prose-navy max-w-none font-serif text-navy-800 leading-loose"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {/* Comments section */}
      {article.commentsEnabled && (
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-t border-navy-50 pt-8">
            <MessageCircle size={22} className="text-purple-600" />
            <h2 className="text-xl font-serif font-bold text-navy-900">
              Community Reflections ({comments.length})
            </h2>
          </div>

          {/* Comment form */}
          {user && !user.isGuest ? (
            <div className="bg-purple-50 rounded-3xl p-6 border border-purple-100">
              {submitSuccess ? (
                <div className="flex items-center gap-3 text-green-700 font-bold">
                  <CheckCircle size={20} className="text-green-500" />
                  <p>Your reflection has been submitted for moderation. It will appear once approved.</p>
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <SaiAvatar gender={user.gender || 'male'} size={36} />
                    <span className="font-bold text-navy-900 text-sm">{user.name}</span>
                  </div>
                  <textarea
                    className="w-full p-4 bg-white rounded-2xl border border-purple-200 text-sm resize-none h-24 focus:border-purple-500 outline-none transition-colors placeholder:text-navy-300"
                    placeholder="Share your reflection on this article..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    maxLength={1000}
                    disabled={isSubmitting}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-navy-400 font-medium">
                      Comments are moderated before appearing publicly.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting || !commentText.trim()}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-md shadow-purple-200"
                    >
                      {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      {isSubmitting ? 'Sending...' : 'Submit'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-3xl p-6 border border-navy-50 text-center">
              <p className="text-navy-500 text-sm font-medium mb-3">
                Sign in to share your reflection on this article.
              </p>
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-navy-800 transition-colors"
              >
                Sign In to Comment
              </Link>
            </div>
          )}

          {/* Comments list */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(c => <CommentItem key={c.id} comment={c} />)}
            </div>
          ) : (
            <div className="text-center py-8 text-navy-300 italic text-sm">
              No reflections yet. Be the first to share yours!
            </div>
          )}
        </section>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Article List View
// ---------------------------------------------------------------------------
const ArticleList = ({ user }: { user: UserProfile | null }) => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(
          query(
            collection(db, 'articles'),
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc')
          )
        );
        setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() } as Article)));
      } catch (err) {
        console.error('Failed to load articles:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const allTags = Array.from(new Set(articles.flatMap(a => a.tags))).sort();

  const filtered = articles.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q));
    const matchesTag = !activeTag || a.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Hero header */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-3 text-purple-600 mb-2">
          <Sparkles size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sai SMS Knowledge Hub</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 leading-tight">
          Articles & Reflections
        </h1>
        <p className="text-navy-400 max-w-xl mx-auto font-medium">
          Spiritual insights, teachings, and community wisdom curated by our coordinators.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300" />
          <input
            className="w-full pl-11 pr-4 py-3 bg-white border border-navy-50 rounded-2xl text-sm font-medium shadow-sm focus:border-gold-400 outline-none transition-colors"
            placeholder="Search articles, authors, or topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-navy-300 shrink-0" />
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                !activeTag ? 'bg-navy-900 text-white' : 'bg-neutral-100 text-navy-400 hover:bg-neutral-200'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTag === tag ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Article grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={40} className="text-gold-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <BookOpen size={48} className="text-navy-200 mx-auto" />
          <p className="text-navy-400 font-medium">
            {articles.length === 0
              ? 'No articles published yet. Check back soon!'
              : 'No articles match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={() => navigate(`/articles/${article.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Export — handles both list and detail
// ---------------------------------------------------------------------------
const ArticlesPage: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  const { articleId } = useParams<{ articleId?: string }>();

  if (articleId) {
    return <ArticleDetail articleId={articleId} user={user} />;
  }
  return <ArticleList user={user} />;
};

export default ArticlesPage;
