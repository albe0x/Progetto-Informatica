import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../helpers/api';
import Post from '../posts/Post';
import { Calendar, X, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function UserPage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit Profile State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ displayName: '', bio: '' });
  const [isSaving, setIsSaving] = useState(false);

  const isOwnProfile = currentUser && profile && currentUser.username === profile.username;

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      let targetUsername = username;
      if (!targetUsername) {
        const meRes = await api.get('/auth/me');
        targetUsername = meRes.data.username;
      }

      const userRes = await api.get(`/user/${targetUsername}`);
      const userData = userRes.data;
      setProfile(userData);
      setEditData({ 
        displayName: userData.displayName || '', 
        bio: userData.bio || '' 
      });

      try {
        const postsRes = await api.get(`/post/user/${userData.id_user}`);
        setPosts(postsRes.data);
      } catch (postErr) {
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

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/user/', editData);
      setIsEditModalOpen(false);
      await fetchUserData(); // Refresh data
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto bg-white dark:bg-black min-h-screen relative">
      {/* Header / Banner Placeholder */}
      <div className="h-48 bg-gray-200 dark:bg-gray-800 w-full relative group">
        {isOwnProfile && (
           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="text-white" size={32} />
           </div>
        )}
      </div>
      
      {/* Profile Info */}
      <div className="px-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="relative flex justify-between items-end -mt-16 mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-black bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          {isOwnProfile && (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="bg-transparent border border-gray-300 dark:border-gray-700 font-bold py-2 px-6 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold">{profile.displayName || profile.username}</h2>
          <p className="text-gray-500">@{profile.username}</p>
        </div>

        {profile.bio && <p className="text-lg mb-4 whitespace-pre-wrap">{profile.bio}</p>}

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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4">
          <div className="bg-white dark:bg-black w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <form onSubmit={handleUpdateProfile}>
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <X size={20} />
                  </button>
                  <span className="font-bold text-lg">Edit Profile</span>
                </div>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-black dark:bg-white text-white dark:text-black font-bold py-1.5 px-6 rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Display Name</label>
                  <input 
                    type="text"
                    value={editData.displayName}
                    onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                    className="w-full bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Your display name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Bio</label>
                  <textarea 
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    className="w-full bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;
