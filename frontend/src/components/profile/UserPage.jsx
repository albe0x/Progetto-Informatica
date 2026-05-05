import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../helpers/api';
import Post from '../posts/Post';
import { Calendar, MapPin, Link as LinkIcon } from 'lucide-react';

function UserPage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        let targetUsername = username;
        let userData = null;

        if (!targetUsername) {
          // 1. Fetch current user identity
          const meRes = await api.get('/auth/me');
          // auth/me returns { id_user, username }
          targetUsername = meRes.data.username;
        }

        // 2. Fetch full user profile by username
        const userRes = await api.get(`/user/${targetUsername}`);
        userData = userRes.data;
        setProfile(userData);

        // 3. Fetch user posts by numeric id_user
        try {
          const postsRes = await api.get(`/post/user/${userData.id_user}`);
          setPosts(postsRes.data);
        } catch (postErr) {
          // If 404, it just means no posts, not a user error
          if (postErr.response?.status === 404) {
            setPosts([]);
          } else {
            console.error("Error fetching posts:", postErr);
          }
        }

      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("User not found or error loading profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto bg-white dark:bg-black min-h-screen">
      {/* Header / Banner Placeholder */}
      <div className="h-48 bg-gray-200 dark:bg-gray-800 w-full"></div>
      
      {/* Profile Info */}
      <div className="px-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="relative flex justify-between items-end -mt-16 mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-black bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <button className="bg-transparent border border-gray-300 dark:border-gray-700 font-bold py-2 px-6 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            Edit Profile
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold">{profile.displayName || profile.username}</h2>
          <p className="text-gray-500">@{profile.username}</p>
        </div>

        {profile.bio && <p className="text-lg mb-4">{profile.bio}</p>}

        <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="flex flex-col gap-[30px] py-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id_post} post={post} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">No posts yet.</p>
        )}
      </div>
    </div>
  );
}

export default UserPage;
