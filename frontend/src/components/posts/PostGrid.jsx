import { useState, useEffect } from 'react';
import Post from './Post';
import api from '../../helpers/api';

function PostGrid() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/post') 
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore con Axios:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Caricamento post...</p>;

  return (
    <div 
      className="flex flex-col w-full max-w-2xl mx-auto py-12 px-4"
      style={{ gap: '30px' }} 
    >
      {posts.map((item) => (
        <Post key={item.id_post} post={item} />
      ))}
    </div>
  );
}

export default PostGrid;
