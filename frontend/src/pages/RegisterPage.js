import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User as UserIcon, Sparkles, ArrowRight } from 'lucide-react';
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
      toast.success('Welcome to StyleMatch! 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] via-[#F5F2ED] to-[#FAFAF9] flex items-center justify-center p-4">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center space-y-8 p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Join StyleMatch Today</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Find Your
              <span className="block text-primary mt-2">Perfect Style</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Connect with top stylists, barbers, and beauty professionals. Book appointments in seconds.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <p className="text-text-secondary">Instant booking with no phone calls</p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <p className="text-text-secondary">Browse portfolios before you book</p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <p className="text-text-secondary">Real reviews from real customers</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full">
          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-right duration-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }} data-testid="register-title">
                Create Account
              </h2>
              <p className="text-text-secondary">Start your style journey with StyleMatch</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    data-testid="register-fullname-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    data-testid="register-email-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary" htmlFor="password">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    data-testid="register-password-input"
                  />
                </div>
                <p className="text-xs text-text-muted">Must be at least 6 characters</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary" htmlFor="role">
                  I am a
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white"
                  data-testid="register-role-select"
                >
                  <option value="customer">Customer - Looking for services</option>
                  <option value="business_owner">Business Owner - Offering services</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                data-testid="register-submit-button"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Account...
                  </span>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-text-secondary">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline transition-all"
                  data-testid="register-login-link"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
