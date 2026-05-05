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
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setSearchParams({ q: e.target.value })}
          className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-full py-3 pl-14 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {query && (
          <button 
            onClick={handleClear}
            className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>

      {query.length > 1 ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-4 mb-2">
            <h3 className="text-xl font-bold">Search results for "{query}"</h3>
          </div>
          {searchResults.length > 0 ? (
            <div className="flex flex-col">
              {searchResults.map(user => (
                <Link 
                  key={user.id_user}
                  to={`/profile/${user.username}`}
                  className="p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {user.displayName || user.username}
                    </p>
                    <p className="text-gray-500 text-sm">@{user.username}</p>
                    {user.bio && <p className="text-sm mt-1 line-clamp-1 text-gray-700 dark:text-gray-300">{user.bio}</p>}
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
