import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Atom } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    displayName: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      // Auto-login after successful registration
      await login(formData.username, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-black text-black dark:text-white px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Atom className="text-blue-500" size={48} />
        </div>
        <h2 className="text-3xl font-bold text-center">Create your account</h2>
        {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/20 p-2 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-4 bg-transparent border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="text"
            name="displayName"
            placeholder="Display Name"
            value={formData.displayName}
            onChange={handleChange}
            className="w-full p-4 bg-transparent border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 bg-transparent border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-4 bg-transparent border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Sign up
          </button>
        </form>
        <p className="text-center text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
