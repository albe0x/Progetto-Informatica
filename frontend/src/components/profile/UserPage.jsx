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

  // Function to fetch all necessary data for the user profile
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      let targetUsername = username;
      // If visiting '/profile', fetch the currently logged-in user
      if (!targetUsername) {
        const meRes = await api.get('/auth/me');
        targetUsername = meRes.data.username;
      }

      // Step 1: Fetch basic user details
      const userRes = await api.get(`/user/${targetUsername}`);
      const userData = userRes.data;
      setProfile(userData);
      
      // Pre-fill edit form with existing data
      setEditData({ 
        displayName: userData.displayName || '', 
        bio: userData.bio || '' 
      });

      // Step 2: Fetch user's posts (swallowing 404 if user has no posts)
      try {
        const postsRes = await api.get(`/post/user/${userData.id_user}`);
        setPosts(postsRes.data);
      } catch (postErr) {
        if (postErr.response?.status === 404) {
          setPosts([]); // Zero posts is a valid state
        } else {
          throw postErr;
        }
      }
    } catch (err) {
      console.error("Profile Fetch Error:", err);
      setError("User profile could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger data fetch whenever the username in the URL changes
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
    <div className="flex flex-col w-full max-w-2xl mx-auto bg-white dark:bg-black min-h-screen relative border-x border-gray-100 dark:border-gray-800">
      
      {/* Banner / Header Area */}
      <div className="h-40 md:h-52 bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-700 dark:to-blue-900 w-full relative group">
        {isOwnProfile && (
           <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="text-white drop-shadow-md" size={32} />
           </div>
        )}
      </div>
      
      {/* Profile Main Info */}
      <div className="px-6 pb-8">
        <div className="relative flex justify-between items-end -mt-12 md:-mt-16 mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-black bg-blue-500 shadow-xl flex items-center justify-center text-white text-4xl font-black">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          {isOwnProfile && (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="bg-transparent border-2 border-gray-200 dark:border-gray-800 font-black py-2.5 px-6 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-all active:scale-95 text-sm"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="space-y-1 mb-6">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">{profile.displayName || profile.username}</h2>
          <p className="text-gray-500 font-medium">@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="text-base md:text-lg mb-6 whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
            {profile.bio}
          </p>
        )}

        <div className="flex flex-wrap gap-6 text-gray-500 text-sm font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar size={18} className="text-blue-500" />
            <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Profile Navigation (Static Placeholder for Polish) */}
      <div className="flex border-b border-gray-100 dark:border-gray-800">
        <div className="px-8 py-4 border-b-4 border-blue-500 font-black text-sm uppercase tracking-widest">
          Posts
        </div>
      </div>

      {/* Feed Area */}
      <div className="flex flex-col py-2">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id_post} post={post} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
              <Camera size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-black mb-2">No posts yet</h3>
            <p className="text-gray-500">When @{profile.username} shares something, it will appear here.</p>
          </div>
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
