import { Home, Search, Bell, Mail, User, MoreHorizontal, Feather } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
  <Link to={path} className={`flex items-center gap-4 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-fit ${active ? 'font-bold' : ''}`}>
    <Icon size={28} />
    <span className="text-xl hidden xl:block">{label}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();

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

      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 xl:px-24 rounded-full mt-4 transition-colors hidden xl:block">
        Post
      </button>
      <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full mt-4 transition-colors block xl:hidden">
        <Feather size={24} />
      </button>

      <div className="mt-auto mb-4 p-3 flex items-center gap-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="hidden xl:block flex-grow">
          <p className="font-bold text-sm">Username</p>
          <p className="text-gray-500 text-sm">@username</p>
        </div>
        <MoreHorizontal className="hidden xl:block" size={20} />
      </div>
    </div>
  );
};

export default Sidebar;
