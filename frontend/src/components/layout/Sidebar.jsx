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

  // Close the popup if clicking outside the sidebar/menu area
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
    <div className="flex flex-col h-screen sticky top-0 px-2 xl:px-4 py-2 border-r border-gray-200 dark:border-gray-800 w-fit xl:w-64">
      <div className="p-3 mb-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-fit">
        <Feather className="text-blue-500" size={32} />
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        <SidebarItem icon={Home} label="Home" path="/" active={location.pathname === '/'} />
        <SidebarItem icon={Search} label="Explore" path="/explore" active={location.pathname === '/explore'} />
        <SidebarItem icon={Bell} label="Notifications" path="/notifications" active={location.pathname === '/notifications'} />
        <SidebarItem icon={Mail} label="Messages" path="/messages" active={location.pathname === '/messages'} />
        <SidebarItem icon={User} label="Profile" path="/profile" active={location.pathname.startsWith('/profile')} />
        <SidebarItem icon={MoreHorizontal} label="More" path="/more" />
      </nav>

<div className="relative mt-4 w-full" ref={postMenuRef}>
  {/* The Floating Menu */}
  {showPostMenu && (
    <div className="absolute bottom-full left-0 mb-4 w-[350px] xl:w-[500px] bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] z-[70] overflow-hidden">
      <div className="p-2">
        {/* We pass the close function to the component */}
        <CreatePost onPostCreated={() => setShowPostMenu(false)} />
      </div>
    </div>
  )}

  {/* The Big Blue Post Button */}
  <button 
    onClick={(e) => {
      e.preventDefault();
      setShowPostMenu(!showPostMenu);
    }}
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 xl:px-24 rounded-full transition-colors hidden xl:block mb-4 w-full shadow-lg active:scale-95"
  >
    Post
  </button>
</div>

<UserButton />
    </div>
  );
};

export default Sidebar;
