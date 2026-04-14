import { useState, useEffect } from 'react';
import Post from './Post';

function PostGrid() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.albe0x.com/api/post' , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': '5d9ff32f3157aa75fabb2f945a933b45adaf56f061e4ef0f512fb9e700f67902' //TEST TOCKEN
        }
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore nel fetch:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Caricamento post...</p>;

  return (
    <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
      {posts.map((item) => (
        <Post key={item.id_post} post={item} />
      ))}
    </div>
  );
}

export default PostGrid;