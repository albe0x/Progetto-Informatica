import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import PostGrid from './components/posts/PostGrid';
import PostExplore from './components/posts/PostExplore';
import UserPage from './components/profile/UserPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Chat from './components/messages/Chat'; 

const Notifications = () => <div className="p-4">Notifications Page</div>;

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center text-black dark:text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
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
              <Route path="explore" element={<PostExplore />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="messages" element={<Chat />} />
              
              <Route path="profile" element={<UserPage />} />
              <Route path="profile/:username" element={<UserPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
