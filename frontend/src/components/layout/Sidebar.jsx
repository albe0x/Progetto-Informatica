import { Home, Search, Bell, Mail, User, MoreHorizontal, Feather } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import UserButton from '../profile/UserButton';
import CreatePost from '../posts/CreatePost';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
  <Link to={path} className={`flex items-center gap-4 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-fit ${active ? 'font-bold' : ''}`}>
    <Icon size={28} />
    <span className="text-xl hidden xl:block">{label}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const [showPostMenu, setShowPostMenu] = useState(false);
  const postMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (postMenuRef.current && !postMenuRef.current.contains(event.target)) {
        setShowPostMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-screen sticky top-0 px-2 xl:px-4 py-4 border-r border-gray-200 dark:border-gray-800 w-fit xl:w-64 bg-white dark:bg-black overflow-visible">
      {/* 1. Top Logo */}
      <div className="p-3 mb-4 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-fit">
        <Feather className="text-blue-500" size={32} />
      </div>

      {/* 2. Navigation */}
      <nav className="flex flex-col gap-1">
        <SidebarItem icon={Home} label="Home" path="/" active={location.pathname === '/'} />
        <SidebarItem icon={Search} label="Explore" path="/explore" active={location.pathname === '/explore'} />
        <SidebarItem icon={Bell} label="Notifications" path="/notifications" active={location.pathname === '/notifications'} />
        <SidebarItem icon={Mail} label="Messages" path="/messages" active={location.pathname === '/messages'} />
        <SidebarItem icon={User} label="Profile" path="/profile" active={location.pathname.startsWith('/profile')} />
        <SidebarItem icon={MoreHorizontal} label="More" path="/more" />
      </nav>

      {/* 3. Post Section - Fixed syntax and responsive buttons */}
      <div className="relative w-full mt-8" ref={postMenuRef}>
        {showPostMenu && (
          <div 
            className="absolute bottom-full left-0 mb-4 w-[400px] xl:w-[600px] bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[100] overflow-hidden"
          >
            <CreatePost onPostCreated={() => setShowPostMenu(false)} />
          </div>
        )}

        {/* Desktop Button */}
        <button 
          onClick={() => setShowPostMenu(!showPostMenu)}
          className="hidden xl:block bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 w-full rounded-full text-xl shadow-lg transition-all active:scale-95"
        >
          Post
        </button>

        {/* Mobile Button (Shows when sidebar is collapsed) */}
        <button 
          onClick={() => setShowPostMenu(!showPostMenu)}
          className="xl:hidden bg-blue-500 p-3 text-white rounded-full flex justify-center w-fit mx-auto shadow-lg active:scale-95"
        >
          <Feather size={24} />
        </button>
      </div>

      {/* 4. User Button - Pushed to the bottom */}
      <div className="mt-auto pt-4">
        <UserButton />
      </div>
    </div>
  );
};

export default Sidebar;
