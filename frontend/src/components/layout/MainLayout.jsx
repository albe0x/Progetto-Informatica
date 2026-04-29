import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="flex w-full max-w-7xl">
        <header className="flex-shrink-0 flex justify-end">
          <Sidebar />
        </header>
        
        <main className="flex-grow border-r border-gray-200 dark:border-gray-800 max-w-[600px] w-full min-h-screen">
          <Outlet />
        </main>

        <aside className="flex-shrink-0">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
};

export default MainLayout;
