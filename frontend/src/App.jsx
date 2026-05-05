import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import PostGrid from './components/posts/PostGrid';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Chat from './components/messages/Chat'; 

const Explore = () => <div className="p-4 text-2xl font-bold">Explore Page</div>;
const Notifications = () => <div className="p-4">Notifications Page</div>;
const Profile = () => <div className="p-4">Profile Page</div>;

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center text-black dark:text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<PostGrid />} />
            <Route path="explore" element={<Explore />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="messages" element={<Chat />} />
            
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:username" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;