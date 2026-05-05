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
    /* gap-[200px] crea una separazione netta di 200 pixel tra ogni post */
    /* w-full e max-w-2xl mantengono il contenuto centrato e largo */
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-y-[200px] py-20">
      {posts.map((item) => (
        <Post key={item.id_post} post={item} />
      ))}
    </div>
  );
}

export default PostGrid;
