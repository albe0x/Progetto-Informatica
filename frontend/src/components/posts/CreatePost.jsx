import { useState } from 'react';
import { Image, Link as LinkIcon } from 'lucide-react';
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
      // Sends the post to your backend
      await api.post('/post', { 
        content: content,
        title: content.substring(0, 25) // Optional: create a title from first chars
      });
      
      setContent('');
      if (onPostCreated) onPostCreated(); // Closes the popup on success
    } catch (err) {
      console.error("Post creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-black p-6">
      <div className="flex flex-col w-full">
        {/* Text Area - Full Width */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full bg-transparent text-2xl border-none focus:ring-0 resize-none placeholder-gray-500 min-h-[180px] p-0"
        />
        
        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
          <div className="flex gap-6 text-blue-500">
            {/* Kept Image and Link icons only */}
            <button className="hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors">
              <Image size={24} />
            </button>
            <button className="hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors">
              <LinkIcon size={24} />
            </button>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2.5 px-8 rounded-full text-lg shadow-md transition-all active:scale-95"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;