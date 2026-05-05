import { useState, useEffect, useRef } from 'react';
import { Send, Hash, Info, Plus, Search, X } from 'lucide-react';
import api from '../../helpers/api';
import Message from './Message';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // New Conversation State
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [chatName, setChatName] = useState('');
  
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await api.get('/chat/');
      setChats(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  useEffect(() => {
    if (activeChat) {
      api.get(`/chat/${activeChat.id_chat}/messages`)
        .then(res => setMessages(res.data))
        .catch(err => console.error("Error fetching messages:", err));
    }
  }, [activeChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Search for users to start a chat
  useEffect(() => {
    if (searchQuery.length > 1) {
      api.get(`/user/search?q=${searchQuery}`)
        .then(res => {
          // Filter out already selected users
          const filtered = res.data.filter(u => !selectedUsers.find(su => su.id_user === u.id_user));
          setSearchResults(filtered);
        })
        .catch(err => console.error("Search error:", err));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedUsers]);

  const toggleUserSelection = (user) => {
    if (selectedUsers.find(u => u.id_user === user.id_user)) {
      setSelectedUsers(selectedUsers.filter(u => u.id_user !== user.id_user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
      setSearchQuery('');
    }
  };

  const createChat = async () => {
    if (selectedUsers.length === 0) return;
    
    let finalName = chatName.trim();
    if (!finalName) {
      if (selectedUsers.length === 1) {
        finalName = selectedUsers[0].username;
      } else {
        const othersCount = selectedUsers.length - 1;
        finalName = `${selectedUsers[0].username} & ${othersCount} other${othersCount > 1 ? 's' : ''}`;
      }
    }

    try {
      const res = await api.post('/chat/', {
        name: finalName,
        members: selectedUsers.map(u => u.username)
      });
      
      // Refresh chat list and open the new chat
      await fetchChats();
      setActiveChat({ id_chat: res.data.id_chat, name: finalName });
      setShowNewChatModal(false);
      setSearchQuery('');
      setSelectedUsers([]);
      setChatName('');
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

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

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-white dark:bg-black relative">
      
      {/* LEFT: Chat List */}
      <div className="w-1/3 border-r border-gray-100 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Messages</h2>
          <button 
            onClick={() => setShowNewChatModal(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-blue-500 transition-colors"
          >
            <Plus size={22} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          {chats.map(chat => (
            <div 
              key={chat.id_chat}
              onClick={() => setActiveChat(chat)}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                activeChat?.id_chat === chat.id_chat ? 'bg-gray-50 dark:bg-white/5' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {chat.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="font-bold truncate">{chat.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Active Conversation */}
      <div className="flex-grow flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="font-bold text-lg">{activeChat.name}</span>
              <Info size={20} className="text-blue-500" />
            </div>

            <div className="flex-grow overflow-y-auto p-4 flex flex-col">
              {messages.map(msg => (
                <Message key={msg.id_message} message={msg} />
              ))}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Start a new message"
                className="flex-grow bg-gray-100 dark:bg-gray-900 border-none rounded-full py-2 px-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button type="submit" className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full">
                <Send size={22} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Select a message</h3>
            <button 
              onClick={() => setShowNewChatModal(true)}
              className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full mt-4 hover:bg-blue-600 transition-colors"
            >
              New Message
            </button>
          </div>
        )}
      </div>

      {/* MODAL: New Conversation */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[10vh]">
          <div className="bg-white dark:bg-black w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowNewChatModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <X size={20} />
                </button>
                <span className="font-bold text-lg">New Message</span>
              </div>
              <button 
                onClick={createChat}
                disabled={selectedUsers.length === 0}
                className="bg-blue-500 text-white font-bold py-1.5 px-4 rounded-full disabled:opacity-50 hover:bg-blue-600 transition-colors"
              >
                Create
              </button>
            </div>

            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <input 
                type="text"
                placeholder="Chat Name (optional for 1-on-1)"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 outline-none mb-3"
              />
              
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedUsers.map(user => (
                  <div key={user.id_user} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-1 px-3 rounded-full text-sm font-bold">
                    @{user.username}
                    <X size={14} className="cursor-pointer" onClick={() => toggleUserSelection(user)} />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Search size={18} className="text-blue-500" />
                <input 
                  type="text"
                  autoFocus
                  placeholder="Search people"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 py-2"
                />
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              {searchResults.map(user => (
                <div 
                  key={user.id_user}
                  onClick={() => toggleUserSelection(user)}
                  className="p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{user.displayName || user.username}</p>
                    <p className="text-gray-500 text-sm">@{user.username}</p>
                  </div>
                </div>
              ))}
              {searchQuery && searchResults.length === 0 && (
                <p className="p-8 text-center text-gray-500">No results found for "{searchQuery}"</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;