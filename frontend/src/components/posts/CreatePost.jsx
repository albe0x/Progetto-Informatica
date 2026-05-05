import { useState } from 'react';
import { Image, Link as LinkIcon, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../helpers/api';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // New state for the link
  const [showLinkInput, setShowLinkInput] = useState(false); // Toggle for the input field
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl.trim()) return;
    
    setLoading(true);
    try {
      // Sending both content and the image link to the backend
      await api.post('/post', { 
        content: content,
        imageUrl: imageUrl, // Sending the picture link
        title: content.substring(0, 25) 
      });
      
      setContent('');
      setImageUrl('');
      setShowLinkInput(false);
      if (onPostCreated) onPostCreated(); 
    } catch (err) {
      console.error("Post creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-black p-6 m-2">
      <div className="flex flex-col w-full">
        {/* Main Text Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full bg-transparent text-2xl border-none focus:ring-0 resize-none placeholder-gray-500 min-h-[150px] p-0"
        />

        {/* --- Dynamic Image Link Input --- */}
        {showLinkInput && (
          <div className="mt-4 flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-blue-500/30">
            <LinkIcon size={18} className="text-blue-500" />
            <input 
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste picture URL here..."
              className="flex-grow bg-transparent border-none focus:ring-0 text-sm"
              autoFocus
            />
            <button onClick={() => {setShowLinkInput(false); setImageUrl('');}}>
              <X size={18} className="text-gray-500 hover:text-red-500" />
            </button>
          </div>
        )}

        {/* --- Image Preview --- */}
        {imageUrl && (
          <div className="relative mt-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full max-h-[300px] object-cover"
              onError={(e) => {
                e.target.style.display = 'none'; // Hide if link is broken
              }}
            />
          </div>
        )}
        
        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
          <div className="flex gap-6 text-blue-500">
            {/* Click this to show the URL input field */}
            <button 
              onClick={() => setShowLinkInput(!showLinkInput)}
              className={`p-2 rounded-full transition-colors ${showLinkInput ? 'bg-blue-100 dark:bg-blue-900/40' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
            >
              <Image size={24} />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={(!content.trim() && !imageUrl.trim()) || loading}
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