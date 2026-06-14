import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <div className="card p-8">
            <h1
              className="text-3xl font-bold mb-2 text-center"
              style={{ fontFamily: 'Outfit, sans-serif' }}
              data-testid="login-title"
            >
              Welcome Back
            </h1>
            <p className="text-text-secondary text-center mb-8">
              Login to manage your bookings
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10"
                    data-testid="login-email-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10"
                    data-testid="login-password-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="login-submit-button"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-center mt-6 text-text-secondary">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary font-semibold hover:underline"
                data-testid="login-register-link"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
