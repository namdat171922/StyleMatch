import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const { register: registerUser, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await registerUser(email, password, fullName, role);

    if (result.success) {
      toast.success('Registration successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Registration failed');
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
              data-testid="register-title"
            >
              Create Account
            </h1>
            <p className="text-text-secondary text-center mb-8">
              Join UniBooking and start booking services
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-10"
                    data-testid="register-fullname-input"
                  />
                </div>
              </div>

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
                    data-testid="register-email-input"
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
                    minLength={6}
                    className="w-full pl-10"
                    data-testid="register-password-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="role">
                  I am a
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full"
                  data-testid="register-role-select"
                >
                  <option value="customer">Customer</option>
                  <option value="business_owner">Business Owner</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="register-submit-button"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center mt-6 text-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
                data-testid="register-login-link"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
