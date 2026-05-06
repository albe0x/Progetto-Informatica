import { Home, Search, Bell, Mail, User, MoreHorizontal, Feather, X, Atom, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import UserButton from '../profile/UserButton';
import CreatePost from '../posts/CreatePost';
import { useTheme } from '../../context/ThemeContext';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
  <Link 
    to={path} 
    className={`flex items-center gap-4 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-fit xl:w-full ${
      active ? 'font-bold text-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-700 dark:text-gray-300'
    }`}
  >
    <Icon size={28} className={active ? 'text-blue-500' : ''} />
    <span className="text-xl hidden xl:block">{label}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const [showPostMenu, setShowPostMenu] = useState(false);
  const postMenuRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (postMenuRef.current && !postMenuRef.current.contains(event.target)) {
        setShowPostMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [showPostMenu]);

  return (
    <div className="flex flex-col h-screen sticky top-0 px-2 xl:px-4 py-4 border-r border-gray-200 dark:border-gray-800 w-fit xl:w-64 bg-white dark:bg-black overflow-visible z-20">
      
      {/* 1. Logo and Theme Toggle */}
      <div className="flex items-center justify-between p-3 mb-4">
        <div className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-fit">
          <Atom className="text-blue-500" size={32} />
        </div>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* 2. Navigation Items */}
      <nav className="flex flex-col gap-1">
        <SidebarItem icon={Home} label="Home" path="/" active={location.pathname === '/'} />
        <SidebarItem icon={Search} label="Explore" path="/explore" active={location.pathname === '/explore'} />
        <SidebarItem icon={Mail} label="Messages" path="/messages" active={location.pathname === '/messages'} />
        <SidebarItem icon={User} label="Profile" path="/profile" active={location.pathname.startsWith('/profile')} />
      </nav>

      {/* 3. Post Trigger Section */}
      <div className="mt-8">
        <button 
          onClick={() => setShowPostMenu(true)}
          className="hidden xl:block bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 w-full rounded-full text-xl shadow-lg transition-all active:scale-95"
        >
          Post
        </button>
        <button 
          onClick={() => setShowPostMenu(true)}
          className="xl:hidden bg-blue-500 p-3 text-white rounded-full flex justify-center w-fit mx-auto shadow-lg active:scale-95"
        >
          <Feather size={24} />
        </button>
      </div>

    {showPostMenu && (
      <div className="fixed inset-0 z-999 flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[10vh] px-4">
        <div 
          ref={postMenuRef}
          className="bg-white dark:bg-black w-full max-w-[600px] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowPostMenu(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <span className="font-bold text-lg">Create New Post</span>
            </div>
          </div>
          <CreatePost onPostCreated={() => setShowPostMenu(false)} />
        </div>
      </div>
    )}

      <div className="mt-auto pt-4">
        <UserButton />
      </div>
    </div>
  );
};

export default Sidebar;