import { useAuth } from '../../context/AuthContext';

const Message = ({ message }) => {
  const { user } = useAuth();
  const isMe = message.username === user?.username;

  return (
    <div className={`flex flex-col mb-4 ${isMe ? 'items-end' : 'items-start'}`}>
      <div className="flex items-end gap-2 max-w-[80%]">
        {!isMe && (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center text-xs font-bold">
            {message.username?.charAt(0).toUpperCase()}
          </div>
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