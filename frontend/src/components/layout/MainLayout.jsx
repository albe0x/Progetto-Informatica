import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const MainLayout = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="flex justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white relative">
      {/* Global Theme Toggle - Fixed to viewport top-right */}
      <button 
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-[100] p-3 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 shadow-lg hover:scale-110 transition-all active:scale-95 group"
        title="Toggle Dark Mode"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="flex w-full max-w-7xl relative">
        <header className="flex-shrink-0 flex justify-end z-20">
          <Sidebar />
        </header>
        
        <main className="flex-grow border-r border-l border-gray-200 dark:border-gray-800 max-w-[800px] w-full min-h-screen">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default MainLayout;
