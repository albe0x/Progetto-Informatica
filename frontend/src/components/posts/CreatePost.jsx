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
        title: content.substring(0, 20), // Placeholder title
        content: content,
        imageUrl: null
      });
      setContent('');
      if (onPostCreated) onPostCreated(); // Refresh the feed
    } catch (err) {
      console.error("Failed to create post", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex gap-4">
      {/* Current User Avatar */}
      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
        {user?.username?.charAt(0).toUpperCase()}
      </div>

      <div className="flex flex-col flex-grow">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full bg-transparent text-xl border-none focus:ring-0 resize-none placeholder-gray-500 min-h-[100px]"
        />
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
          {/* Action Icons */}
          <div className="flex gap-2 text-blue-500">
            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
              <Image size={20} />
            </button>
            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
              <Smile size={20} />
            </button>
            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
              <Calendar size={20} />
            </button>
            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
              <MapPin size={20} />
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-full transition-colors"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;