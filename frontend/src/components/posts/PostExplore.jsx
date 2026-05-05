import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Post from './Post';
import api from '../../helpers/api';
import { Search, X } from 'lucide-react';

function PostExplore() {
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    // Load base feed
    api.get('/post') 
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore caricamento explore:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (query.trim().length > 1) {
      const delayDebounceFn = setTimeout(() => {
        api.get(`/user/search?q=${query}`)
          .then(res => setSearchResults(res.data))
          .catch(err => console.error("Search error:", err));
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const handleClear = () => {
    setSearchParams({});
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-8 px-4 border-x border-gray-100 dark:border-gray-800 min-h-screen">
      {/* Search Section */}
      <div className="relative mb-10 px-4">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search for people..."
            value={query}
            onChange={(e) => setSearchParams({ q: e.target.value })}
            className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-black rounded-full py-4 pl-16 pr-12 outline-none transition-all font-medium text-lg"
          />
          {query && (
            <button 
              onClick={handleClear}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {query.length > 1 ? (
        /* Results Section: only shown when searching */
        <div className="flex flex-col gap-6 px-2">
          <div className="px-4">
            <h3 className="text-2xl font-black tracking-tight">Search results</h3>
            <p className="text-gray-500 text-sm">Showing results for "{query}"</p>
          </div>
          
          {searchResults.length > 0 ? (
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800 border-y border-gray-100 dark:border-gray-800">
              {searchResults.map(user => (
                <Link 
                  key={user.id_user}
                  to={`/profile/${user.username}`}
                  className="p-6 flex items-center gap-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-black text-xl text-gray-900 dark:text-white truncate">
                      {user.displayName || user.username}
                    </p>
                    <p className="text-gray-500 font-medium">@{user.username}</p>
                    {user.bio && (
                      <p className="text-sm mt-2 line-clamp-2 text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty Search State */
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
                <Search size={40} className="text-gray-300" />
              </div>
              <p className="text-gray-500 text-xl font-bold">No results found for "{query}"</p>
              <p className="text-gray-400 mt-2">Try checking the spelling or searching for someone else.</p>
            </div>
          )}
        </div>
      ) : (
        /* Default Explore View: shows global feed */
        <>
          <div className="px-6 mb-8">
            <h2 className="text-3xl font-black tracking-tight">Explore</h2>
            <p className="text-gray-500 font-medium mt-1">Discover trending posts across the platform</p>
          </div>
          {loading ? (
            <div className="p-20 text-center text-gray-500 font-medium animate-pulse italic">
              Scanning the network for content...
            </div>
          ) : (
            <div className="flex flex-col">
              {posts.map((item) => (
                <Post key={item.id_post} post={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PostExplore;
