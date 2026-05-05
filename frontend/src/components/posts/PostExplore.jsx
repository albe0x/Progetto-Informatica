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
    <div className="flex flex-col w-full max-w-2xl mx-auto py-8 px-4">
      {/* Search Bar */}
      <div className="relative mb-8 px-4">
        <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setSearchParams({ q: e.target.value })}
          className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-full py-3.5 pl-16 pr-12 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        {query && (
          <button 
            onClick={handleClear}
            className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        )}
      </div>

      {query.length > 1 ? (
        <div className="flex flex-col gap-4 px-2">
          <div className="flex items-center justify-between px-4 mb-2">
            <h3 className="text-xl font-bold">Search results for "{query}"</h3>
          </div>
          {searchResults.length > 0 ? (
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
              {searchResults.map(user => (
                <Link 
                  key={user.id_user}
                  to={`/profile/${user.username}`}
                  className="p-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-2xl shadow-sm shrink-0">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-lg text-gray-900 dark:text-white truncate">
                      {user.displayName || user.username}
                    </p>
                    <p className="text-gray-500 text-sm">@{user.username}</p>
                    {user.bio && <p className="text-sm mt-1.5 line-clamp-2 text-gray-700 dark:text-gray-300 leading-relaxed">{user.bio}</p>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No users found for "{query}"</p>
              <p className="text-gray-400 text-sm mt-1">Try searching for another username or display name.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="px-6 mb-6">
            <h2 className="text-2xl font-bold">Explore</h2>
            <p className="text-gray-500 text-sm">Recommended posts for you</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading posts...</div>
          ) : (
            <div className="flex flex-col gap-[30px]">
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
