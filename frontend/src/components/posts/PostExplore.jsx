import { useState, useEffect } from 'react';
import Post from './Post';
import api from '../../helpers/api';

function PostExplore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, explore also uses the main feed endpoint or a similar one if available
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

  if (loading) return <div className="p-8 text-center">Loading posts...</div>;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 px-6">Explore</h2>
      <div className="flex flex-col gap-[30px]">
        {posts.map((item) => (
          <Post key={item.id_post} post={item} />
        ))}
      </div>
    </div>
  );
}

export default PostExplore;
