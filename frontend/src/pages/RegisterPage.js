import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User as UserIcon, Sparkles, ArrowRight, Scissors, Heart, Star } from 'lucide-react';
import { toast } from 'sonner';

const FloatingElement = ({ delay, duration, icon: Icon, className }) => (
  <div
    className={`absolute ${className}`}
    style={{
      animation: `float ${duration}s ease-in-out ${delay}s infinite`,
    }}
  >
    <Icon className="w-8 h-8 text-primary/30" />
  </div>
);

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { register: registerUser, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAF9] via-[#F5F2ED] to-[#E8E5DF]">
        {/* Animated Mesh Gradient Blobs */}
        <div
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-accent/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"
          style={{ animationDelay: '4s' }}
        ></div>

        {/* Floating Icons */}
        <FloatingElement icon={Scissors} delay={0} duration={6} className="top-20 left-[10%]" />
        <FloatingElement icon={Heart} delay={1} duration={8} className="top-40 right-[15%]" />
        <FloatingElement icon={Star} delay={2} duration={7} className="bottom-32 left-[20%]" />
        <FloatingElement icon={Sparkles} delay={0.5} duration={9} className="bottom-20 right-[25%]" />

        {/* Animated Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 5}s ease-in-out ${Math.random() * 5}s infinite`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}

        {/* Mouse Follower Gradient */}
        <div
          className="absolute w-96 h-96 bg-primary/10 rounded-full filter blur-3xl transition-all duration-300 pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Enhanced Branding */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 p-8">
            <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full border border-primary/30 shadow-lg">
                <div className="relative">
                  <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  <div className="absolute inset-0 animate-ping">
                    <Sparkles className="w-6 h-6 text-primary opacity-75" />
                  </div>
                </div>
                <span className="text-sm font-bold text-primary tracking-wide">Join 50,000+ Happy Clients</span>
              </div>
              
              <h1 className="text-6xl font-bold leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x">
                  Find Your
                </span>
                <br />
                <span className="inline-block mt-3 text-primary relative">
                  Perfect Style
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path
                      d="M2 9C50 3 150 1 298 9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="animate-draw"
                    />
                  </svg>
                </span>
              </h1>
              
              <p className="text-xl text-text-secondary leading-relaxed max-w-lg">
                Connect with top stylists, barbers, and beauty professionals. Book appointments instantly.
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: '⚡', text: 'Instant booking with no phone calls', delay: '0.1s' },
                { icon: '🎨', text: 'Browse stunning portfolios first', delay: '0.2s' },
                { icon: '⭐', text: 'Real reviews from real clients', delay: '0.3s' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-5 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: item.delay }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl shadow-lg">
                    {item.icon}
                  </div>
                  <p className="text-text-primary font-medium">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Animated Stats */}
            <div className="flex gap-6 pt-6">
              {[
                { label: 'Active Users', value: '50K+' },
                { label: 'Professionals', value: '5K+' },
                { label: 'Avg Rating', value: '4.8★' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Glassmorphic Form */}
          <div className="w-full animate-in fade-in slide-in-from-right duration-700">
            <div className="bg-white/40 backdrop-blur-2xl p-8 lg:p-12 rounded-[2rem] shadow-2xl border border-white/50 relative overflow-hidden">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }} data-testid="register-title">
                    Create Account
                  </h2>
                  <p className="text-text-secondary">Start your style journey today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2 group">
                    <label className="block text-sm font-semibold text-text-primary" htmlFor="fullName">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5 group-focus-within:text-primary group-focus-within:scale-110 transition-all" />
                      <input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none hover:border-primary/50"
                        data-testid="register-fullname-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="block text-sm font-semibold text-text-primary" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5 group-focus-within:text-primary group-focus-within:scale-110 transition-all" />
                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none hover:border-primary/50"
                        data-testid="register-email-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="block text-sm font-semibold text-text-primary" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5 group-focus-within:text-primary group-focus-within:scale-110 transition-all" />
                      <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none hover:border-primary/50"
                        data-testid="register-password-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-text-primary" htmlFor="role">
                      I am a
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none hover:border-primary/50"
                      data-testid="register-role-select"
                    >
                      <option value="customer">Customer - Looking for services</option>
                      <option value="business_owner">Business Owner - Offering services</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-primary-hover text-white font-bold py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
                    data-testid="register-submit-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Creating Account...
                      </span>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-text-secondary">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-primary font-bold hover:underline hover:scale-105 inline-block transition-all"
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
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes draw {
          0% { stroke-dasharray: 0 300; }
          100% { stroke-dasharray: 300 0; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-shimmer { animation: shimmer 3s infinite; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 3s ease infinite; }
        .animate-draw { animation: draw 2s ease forwards; }
      `}</style>
    </div>
  );
};

export default RegisterPage;
