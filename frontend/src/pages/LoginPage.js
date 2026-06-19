import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Sparkles, ArrowRight, Scissors, Heart, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';

const FloatingElement = ({ delay, duration, icon: Icon, className }) => (
  <div
    className={`absolute ${className}`}
    style={{
      animation: `float ${duration}s ease-in-out ${delay}s infinite`,
    }}
  >
    <Icon className="w-8 h-8 text-secondary/30" />
  </div>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
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

    const result = await login(email, password);

    if (result.success) {
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E8E5DF] via-[#F5F2ED] to-[#FAFAF9]">
        {/* Morphing Gradient Blobs */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"
          style={{ animationDelay: '4s' }}
        ></div>

        {/* Floating Icons with Different Animations */}
        <FloatingElement icon={Scissors} delay={0} duration={6} className="top-20 right-[10%]" />
        <FloatingElement icon={Heart} delay={1} duration={8} className="top-40 left-[15%]" />
        <FloatingElement icon={Star} delay={2} duration={7} className="bottom-32 right-[20%]" />
        <FloatingElement icon={Zap} delay={0.5} duration={9} className="bottom-20 left-[25%]" />

        {/* Animated Light Rays */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 bg-gradient-to-b from-primary/20 to-transparent"
            style={{
              height: Math.random() * 200 + 100 + 'px',
              left: (i * 12.5) + '%',
              top: -100,
              animation: `slideDown ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 2}s infinite`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}

        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: Math.random() * 8 + 2 + 'px',
              height: Math.random() * 8 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 5}s ease-in-out ${Math.random() * 5}s infinite`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}

        {/* Interactive Mouse Follower */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full filter blur-3xl transition-all duration-500 pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Animated Branding */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 p-8">
            <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full border border-secondary/30 shadow-lg animate-bounce-slow">
                <div className="relative">
                  <Scissors className="w-6 h-6 text-secondary" />
                  <div className="absolute inset-0 animate-ping">
                    <Scissors className="w-6 h-6 text-secondary opacity-75" />
                  </div>
                </div>
                <span className="text-sm font-bold text-secondary tracking-wide">Welcome Back to StyleMatch</span>
              </div>
              
              <h1 className="text-6xl font-bold leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <span className="inline-block animate-in fade-in slide-in-from-left duration-500">
                  Your Next
                </span>
                <br />
                <span className="inline-block mt-3 bg-clip-text text-transparent bg-gradient-to-r from-secondary via-primary to-secondary animate-gradient-x">
                  Great Look
                  <br />
                  Awaits
                </span>
              </h1>
              
              <p className="text-xl text-text-secondary leading-relaxed max-w-lg animate-in fade-in slide-in-from-left duration-700 delay-200">
                Book appointments with verified professionals. Discover portfolios. Read real reviews.
              </p>
            </div>
            
            {/* Animated Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '50K+', label: 'Happy Clients', delay: '0.1s', color: 'from-primary to-primary-hover' },
                { value: '5K+', label: 'Professionals', delay: '0.2s', color: 'from-secondary to-secondary-hover' },
                { value: '4.8★', label: 'Average Rating', delay: '0.3s', color: 'from-primary to-secondary' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="relative p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 group overflow-hidden"
                  style={{ animationDelay: stat.delay }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-text-muted font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Animated Features */}
            <div className="space-y-3">
              {[
                { icon: '⚡', text: 'Lightning-fast booking process' },
                { icon: '🎨', text: 'Browse stunning work portfolios' },
                { icon: '⭐', text: 'Trusted by thousands daily' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg hover:translate-x-2 transition-all duration-300"
                >
                  <div className="text-2xl animate-bounce-slow">{item.icon}</div>
                  <p className="text-text-primary font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Glassmorphic Login Form */}
          <div className="w-full animate-in fade-in slide-in-from-right duration-700">
            <div className="bg-white/40 backdrop-blur-2xl p-8 lg:p-12 rounded-[2rem] shadow-2xl border border-white/50 relative overflow-hidden group">
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl mb-4 animate-pulse-slow">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }} data-testid="login-title">
                    Welcome Back
                  </h2>
                  <p className="text-text-secondary">Sign in to continue your journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none hover:border-primary/50 hover:shadow-lg"
                        data-testid="login-email-input"
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
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none hover:border-primary/50 hover:shadow-lg"
                        data-testid="login-password-input"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold py-5 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
                    data-testid="login-submit-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {loading ? (
                      <span className="flex items-center gap-2 relative">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Signing in...
                      </span>
                    ) : (
                      <span className="relative flex items-center gap-3">
                        Sign In
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </span>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                  <p className="text-text-secondary">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="text-primary font-bold hover:underline hover:scale-105 inline-block transition-all"
                      data-testid="login-register-link"
                    >
                      Create one now
                    </Link>
                  </p>
                  
                  <div className="pt-6 border-t border-gray-200/50">
                    <p className="text-xs text-center text-text-muted">
                      Secured by StyleMatch • Terms • Privacy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(40px, -60px) scale(1.15) rotate(120deg); }
          66% { transform: translate(-30px, 30px) scale(0.85) rotate(240deg); }
        }
        @keyframes slideDown {
          0% { transform: translateY(-100px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-blob { animation: blob 8s infinite; }
        .animate-shimmer { animation: shimmer 3s infinite; }
        .animate-gradient-x { 
          background-size: 200% 200%; 
          animation: gradient-x 3s ease infinite; 
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .bg-size-200 { background-size: 200% 100%; }
        .bg-pos-0 { background-position: 0% 0%; }
        .bg-pos-100 { background-position: 100% 0%; }
      `}</style>
    </div>
  );
};

export default LoginPage;
