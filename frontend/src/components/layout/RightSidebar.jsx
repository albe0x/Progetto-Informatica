import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrendItem = ({ category, topic, posts }) => (
  <div className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
    <p className="text-gray-500 text-xs">{category} · Trending</p>
    <p className="font-bold text-base">#{topic}</p>
    <p className="text-gray-500 text-xs">{posts} posts</p>
  </div>
);

const RightSidebar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <div className="hidden lg:flex flex-col gap-4 p-4 w-80 xl:w-96 sticky top-0 h-screen overflow-y-auto">
      <div className="sticky top-0 bg-white dark:bg-black py-2 z-10">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </form>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <h2 className="font-bold text-xl p-4">What's happening</h2>
        <TrendItem category="Technology" topic="ReactJS" posts="15.4K" />
        <TrendItem category="Programming" topic="TailwindCSS" posts="8.2K" />
        <TrendItem category="Web" topic="Vite" posts="4.1K" />
        <div className="p-4 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-sm">
          Show more
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <h2 className="font-bold text-xl p-4">Who to follow</h2>
        <div className="p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div>
              <p className="font-bold text-sm">Zencoder AI</p>
              <p className="text-gray-500 text-sm">@zencoder</p>
            </div>
          </div>
          <button className="bg-black dark:bg-white text-white dark:text-black font-bold py-1.5 px-4 rounded-full text-sm">
            Follow
          </button>
        </div>
        <div className="p-4 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-sm">
          Show more
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
