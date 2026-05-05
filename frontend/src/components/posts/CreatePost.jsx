import { useState } from 'react';
import { Image, Smile, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../helpers/api';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await api.post('/post', {
        title: content.substring(0, 20),
        content: content,
        imageUrl: null
      });
      setContent('');
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error("Post failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-black p-6">
      <div className="flex gap-5">
        
        {/* Left Side: Big Avatar Only */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Right Side: Large Input and Spaced Actions */}
        <div className="flex-grow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full bg-transparent text-2xl border-none focus:ring-0 resize-none placeholder-gray-500 min-h-[160px] p-0 pt-2 leading-relaxed"
          />
          
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-900">
            {/* Larger Icons with more gap */}
            <div className="flex gap-6 text-blue-500">
              <Image size={26} className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all" />
              <Smile size={26} className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all" />
              <Calendar size={26} className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all" />
              <MapPin size={26} className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all" />
            </div>

            {/* Bigger Post Button */}
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2.5 px-8 rounded-full text-lg transition-all shadow-md active:scale-95"
            >
              {loading ? '...' : 'Post'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreatePost;