import { useState, useEffect } from 'react';
import Post from './Post';
import api from '../../helpers/api';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

function PostExplore() {
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
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
    if (searchQuery.trim().length > 1) {
      setIsSearching(true);
      const delayDebounceFn = setTimeout(() => {
        api.get(`/user/search?q=${searchQuery}`)
          .then(res => setSearchResults(res.data))
          .catch(err => console.error("Search error:", err));
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-8 px-4">
      {/* Search Bar */}
      <div className="relative mb-8 px-4">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-full py-3 pl-14 pr-6 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {isSearching ? (
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold px-4">Users</h3>
          {searchResults.length > 0 ? (
            searchResults.map(user => (
              <Link 
                key={user.id_user}
                to={`/profile/${user.username}`}
                className="p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-2xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold">{user.displayName || user.username}</p>
                  <p className="text-gray-500 text-sm">@{user.username}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No users found for "{searchQuery}"</p>
          )}
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 px-6">Explore</h2>
          {loading ? (
            <div className="p-8 text-center">Loading posts...</div>
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
