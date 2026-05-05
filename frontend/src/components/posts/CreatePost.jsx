import { useState } from 'react';
import { Image, Link as LinkIcon, X, Type } from 'lucide-react'; // Aggiunta icona Type
import { useAuth } from '../../context/AuthContext';
import api from '../../helpers/api';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(''); // Nuovo stato per il titolo
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(''); 
  const [showLinkInput, setShowLinkInput] = useState(false); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Controllo che ci sia almeno un titolo o del contenuto
    if (!title.trim() && !content.trim() && !imageUrl.trim()) return;
    
    setLoading(true);
    try {
      await api.post('/post', { 
        title: title, // Invia il titolo inserito dall'utente
        content: content,
        imageUrl: imageUrl, 
      });
      
      setTitle(''); // Reset del titolo
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
    <div className="w-full bg-white dark:bg-black p-5">
      <div className="flex flex-col w-full">
        
        {/* Sezione Inserimento Titolo */}
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full bg-transparent text-2xl font-bold border-none focus:ring-0 placeholder-gray-500 mb-2 p-0"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full bg-transparent text-xl border-none focus:ring-0 resize-none placeholder-gray-500 min-h-[120px] p-0"
        />

        {showLinkInput && (
          <div className="mt-2 mb-2 flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-blue-500/30">
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
              <X size={16} className="text-gray-500 hover:text-red-500" />
            </button>
          </div>
        )}

        {imageUrl && (
          <div className="relative mt-3 mb-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full max-h-[250px] object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex gap-4 text-blue-500">
            <button 
              type="button"
              onClick={() => setShowLinkInput(!showLinkInput)}
              className={`p-2 rounded-full transition-colors ${showLinkInput ? 'bg-blue-100 dark:bg-blue-900/40' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
            >
              <Image size={22} />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={(!title.trim() && !content.trim() && !imageUrl.trim()) || loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-full text-md shadow-md transition-all active:scale-95"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
