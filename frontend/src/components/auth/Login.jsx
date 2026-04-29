import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Feather } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-black text-black dark:text-white px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Feather className="text-blue-500" size={48} />
        </div>
        <h2 className="text-3xl font-bold text-center">Sign in to X</h2>
        {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/20 p-2 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 bg-transparent border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-transparent border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Log in
          </button>
        </form>
        <p className="text-center text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
