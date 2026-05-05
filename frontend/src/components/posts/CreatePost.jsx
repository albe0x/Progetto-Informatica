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
      console.error("Failed to create post", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex gap-5 bg-white dark:bg-black min-h-[220px]">
      {/* 1. Bigger Avatar */}
      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-sm">
        {user?.username?.charAt(0).toUpperCase()}
      </div>

      <div className="flex flex-col flex-grow">
        {/* 2. Larger Textarea with more height */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full bg-transparent text-2xl border-none focus:ring-0 resize-none placeholder-gray-500 min-h-[120px] pt-2"
        />
        
        {/* 3. Spaced out footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-900 mt-4">
          <div className="flex gap-4 text-blue-500">
            <Image size={24} className="cursor-pointer hover:opacity-70" />
            <Smile size={24} className="cursor-pointer hover:opacity-70" />
            <Calendar size={24} className="cursor-pointer hover:opacity-70" />
            <MapPin size={24} className="cursor-pointer hover:opacity-70" />
          </div>

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
  );
};

export default CreatePost;