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
    <div className="w-full bg-white dark:bg-black p-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex gap-4">
        
        {/* Left Side: Avatar Only (Simple) */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Right Side: Textarea and Buttons */}
        <div className="flex-grow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full bg-transparent text-xl border-none focus:ring-0 resize-none placeholder-gray-500 min-h-[120px] p-0"
          />
          
          <div className="flex items-center justify-between mt-4">
            {/* Icons Group */}
            <div className="flex gap-4 text-blue-500">
              <Image size={22} className="cursor-pointer" />
              <Smile size={22} className="cursor-pointer" />
              <Calendar size={22} className="cursor-pointer" />
              <MapPin size={22} className="cursor-pointer" />
            </div>

            {/* Post Button */}
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-full transition-all"
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