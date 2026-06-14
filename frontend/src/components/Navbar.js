import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Building2, Calendar } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-text-primary"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            data-testid="navbar-logo"
          >
            Uni<span className="text-primary">Booking</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/businesses"
              className="text-text-secondary hover:text-text-primary transition-colors font-medium"
              data-testid="navbar-businesses"
            >
              Explore
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium"
                  data-testid="navbar-dashboard"
                >
                  <Calendar className="w-4 h-4" />
                  Dashboard
                </Link>

                {user.role === 'business_owner' && (
                  <Link
                    to="/create-business"
                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium"
                    data-testid="navbar-create-business"
                  >
                    <Building2 className="w-4 h-4" />
                    Add Business
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium"
                  data-testid="navbar-logout"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>

                <div
                  className="flex items-center gap-2 px-3 py-2 bg-accent rounded-full"
                  data-testid="navbar-user-info"
                >
                  <User className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium text-text-primary">
                    {user.full_name}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-text-secondary hover:text-text-primary transition-colors font-medium"
                  data-testid="navbar-login"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  data-testid="navbar-register"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
