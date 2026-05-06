import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../helpers/api';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Heart, MessageSquare, CheckCircle, Shield } from 'lucide-react';
/**
 * Post Component: Displays a single social media post.
 */
function Post({ post }) {
  console.log("Post data:", post);
  const { user: currentUser } = useAuth();
  const [likes, setLikes] = useState(post.likes || 0);
...
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const hasImage = post.imageUrl && post.imageUrl.trim() !== '';
  const isOwner = currentUser && currentUser.id_user === post.id_user;
  const canDelete = isOwner || (currentUser && currentUser.isSuperAdmin);

  useEffect(() => {
    // Check if current user has already liked this post
    if (currentUser) {
        api.get(`/post/${post.id_post}/liked-status`).then(res => setIsLiked(res.data.liked));
    }
  }, [currentUser, post.id_post]);

  useEffect(() => {
    if (showComments) {
      api.get(`/post/${post.id_post}/comments`).then(res => setComments(res.data));
    }
  }, [showComments, post.id_post]);

  const handleLike = async () => {
    try {
      const res = await api.post(`/post/${post.id_post}/like`);
      setIsLiked(res.data.liked);
      setLikes(prev => res.data.liked ? prev + 1 : prev - 1);
    } catch (err) { console.error(err); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/post/${post.id_post}/comments`, { content: newComment });
      setComments([...comments, { ...res.data, username: 'Tu' }]); // Semplificazione per feedback immediato
      setNewComment('');
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Eliminare questo post?")) return;
    try {
      await api.delete(`/post/${post.id_post}`);
      setIsDeleted(true);
    } catch (err) { console.error(err); }
  };

  if (isDeleted) return null;

  return (
    <div className="w-full border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50/30 dark:hover:bg-white/[0.02] transition-colors">
      <div className="flex flex-col w-full">
        
        {/* Post Body */}
        <div className="px-6 pt-10 pb-4">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h3>
            <div className="flex items-center gap-4">
              {canDelete && (
                <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                  <Trash2 size={18} />
                </button>
              )}
              <span className="text-[10px] text-gray-400 font-mono uppercase bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {post.content}
          </p>
        </div>

        {hasImage && (
          <div className="w-full px-4 mb-4">
            <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <img src={post.imageUrl} className="w-full h-auto object-cover max-h-[600px]" alt={post.title} />
            </div>
          </div>
        )}

        {/* Interaction Bar */}
        <div className="px-6 py-4 flex items-center gap-6 border-t border-gray-50 dark:border-gray-900/50">
          <button onClick={handleLike} className={`flex items-center gap-2 text-sm font-bold transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} /> {likes}
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-500 transition-colors">
            <MessageSquare size={18} /> Commenti
          </button>
          <Link to={`/profile/${post.username}`} className="ml-auto flex items-center gap-1 text-xs font-black text-blue-500 uppercase tracking-widest">
            @{post.username}
            {post.isVerified && <CheckCircle size={14} className="text-blue-500" />}
            {post.isSuperAdmin && <Shield size={14} className="text-amber-500" />}
          </Link>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="px-6 pb-6 bg-gray-50/50 dark:bg-gray-900/20">
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pt-4">
              {comments.map((c, i) => (
                <div key={i} className="text-sm">
                  <span className="font-bold mr-2">@{c.username}:</span>
                  <span className="text-gray-600 dark:text-gray-400">{c.content}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleComment} className="flex gap-2">
              <input 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Scrivi un commento..."
                className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold">Invia</button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default Post;
