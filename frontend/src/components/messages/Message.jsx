import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Message = ({ message }) => {
  const { user } = useAuth();
  const isMe = message.username === user?.username;

  return (
    <div className={`flex flex-col mb-4 ${isMe ? 'items-end' : 'items-start'}`}>
      {!isMe && (
        <Link 
          to={`/profile/${message.username}`}
          className="text-[10px] font-bold text-gray-500 mb-1 ml-10 hover:underline"
        >
          @{message.username}
        </Link>
      )}
      <div className="flex items-end gap-2 max-w-[80%]">
        {!isMe && (
          <Link 
            to={`/profile/${message.username}`}
            className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity shadow-sm"
          >
            {message.username?.charAt(0).toUpperCase()}
          </Link>
        )}
        
        <div 
          className={`px-4 py-2 rounded-2xl text-sm ${
            isMe 
              ? 'bg-blue-500 text-white rounded-br-none' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
          }`}
        >
          {message.content}
        </div>
      </div>
      <span className="text-[10px] text-gray-500 mt-1 px-1">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

export default Message;
