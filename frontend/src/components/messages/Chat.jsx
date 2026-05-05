import { useState, useEffect, useRef } from 'react';
import { Send, Hash, Info } from 'lucide-react';
import api from '../../helpers/api';
import Message from './Message';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // Fetch list of chats
  useEffect(() => {
    api.get('/chat/')
      .then(res => {
        setChats(res.data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching chats:", err));
  }, []);

  // Fetch messages when activeChat changes
  useEffect(() => {
    if (activeChat) {
      api.get(`/chat/${activeChat.id_chat}/messages`)
        .then(res => setMessages(res.data))
        .catch(err => console.error("Error fetching messages:", err));
    }
  }, [activeChat]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const res = await api.post(`/chat/${activeChat.id_chat}/messages`, {
        content: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading conversations...</div>;

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      {/* Left Sidebar: Chat List */}
      <div className="w-1/3 border-r border-gray-100 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        <div className="overflow-y-auto flex-grow">
          {chats.map(chat => (
            <div 
              key={chat.id_chat}
              onClick={() => setActiveChat(chat)}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                activeChat?.id_chat === chat.id_chat ? 'border-r-4 border-blue-500 bg-gray-50 dark:bg-white/5' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                <Hash size={24} />
              </div>
              <div className="overflow-hidden">
                <p className="font-bold truncate">{chat.name}</p>
                <p className="text-xs text-gray-500">Click to view messages</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane: Chat Window */}
      <div className="flex-grow flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10">
              <div className="flex flex-col">
                <span className="font-bold text-lg">{activeChat.name}</span>
                <span className="text-xs text-gray-500">Chat ID: {activeChat.id_chat}</span>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <Info size={20} className="text-blue-500" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 flex flex-col">
              {messages.length > 0 ? (
                messages.map(msg => (
                  <Message key={msg.id_message} message={msg} />
                ))
              ) : (
                <div className="text-center text-gray-500 my-auto">
                  No messages yet. Start the conversation!
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2"
            >
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Start a new message"
                className="flex-grow bg-gray-100 dark:bg-gray-900 border-none rounded-full py-2 px-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors disabled:opacity-50"
              >
                <Send size={22} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Select a message</h3>
            <p className="text-gray-500 max-w-sm">
              Choose from your existing conversations or start a new one to begin chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;