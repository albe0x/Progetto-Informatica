import { useState } from 'react';
import { Image, Smile, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../helpers/api';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');

  return (
    <div className="w-full bg-white dark:bg-black p-6">
      <div className="flex gap-4">
        {/* Big Avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {user?.username?.charAt(0).toUpperCase()}
        </div>

        <div className="flex flex-col flex-grow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full bg-transparent text-2xl border-none focus:ring-0 resize-none placeholder-gray-500 min-h-[180px] pt-2"
          />
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
            <div className="flex gap-4 text-blue-500">
              <Image size={24} className="cursor-pointer" />
              <Smile size={24} className="cursor-pointer" />
              <Calendar size={24} className="cursor-pointer" />
              <MapPin size={24} className="cursor-pointer" />
            </div>

            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-8 rounded-full text-lg shadow-md"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;