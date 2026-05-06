import { useState, useEffect, useRef } from 'react';
import { LogOut, MoreHorizontal, User, ShieldCheck, CheckCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Sub-component for the circular User Avatar
 */
const UserAvatar = ({ username }) => (
  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
    {username?.charAt(0).toUpperCase() || 'U'}
  </div>
);

/**
 * Sub-component for the User Name and Handle
 */
const UserIdentity = ({ username, isVerified, isSuperAdmin }) => (
  <div className="hidden xl:block flex-grow overflow-hidden text-left">
    <div className="flex items-center gap-1">
      <p className="font-bold text-sm truncate text-gray-900 dark:text-white">
        {username}
      </p>
      {isVerified && <CheckCircle size={14} className="text-blue-500" />}
      {isSuperAdmin && <Shield size={14} className="text-amber-500" />}
    </div>
    <p className="text-gray-500 text-sm truncate">
      @{username?.toLowerCase()}
    </p>
  </div>
);

const UserButton = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the menu if the user clicks anywhere else on the screen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="mt-auto mb-4 w-full relative" ref={menuRef}>
      
      {/* POPUP MENU (Opens above the button) */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-3 w-full min-w-[260px] bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.1)] overflow-hidden z-[60] animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
             <UserAvatar username={user.username} />
             <UserIdentity username={user.username} isVerified={user.isVerified} isSuperAdmin={user.isSuperAdmin} />
          </div>

          <Link 
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm font-bold text-gray-900 dark:text-white"
          >
            <User size={18} />
            View Profile
          </Link>

          <button 
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm font-bold text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-800"
          >
            <LogOut size={18} />
            Log out @{user.username}
          </button>
        </div>
      )}

      {/* TRIGGER BUTTON (The main profile pill) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer group ${isOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
      >
        <UserAvatar username={user.username} />
        <UserIdentity username={user.username} isVerified={user.isVerified} isSuperAdmin={user.isSuperAdmin} />
        
        <div className="hidden xl:block ml-auto">
          <MoreHorizontal className="text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" size={20} />
        </div>
      </div>
    </div>
  );
};

export default UserButton;