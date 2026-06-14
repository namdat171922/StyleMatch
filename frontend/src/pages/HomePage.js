import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Search, Scissors, Sparkles, Heart, Palette, Waves } from 'lucide-react';

const categories = [
  { name: 'Hair Salon', value: 'hair_salon', icon: Scissors, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400' },
  { name: 'Barbershop', value: 'barbershop', icon: Scissors, image: 'https://images.pexels.com/photos/37764947/pexels-photo-37764947.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400' },
  { name: 'Nail Salon', value: 'nail_salon', icon: Sparkles, image: 'https://images.pexels.com/photos/6135675/pexels-photo-6135675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400' },
  { name: 'Spa & Wellness', value: 'spa', icon: Waves, image: 'https://images.pexels.com/photos/18120174/pexels-photo-18120174.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400' },
  { name: 'Tattoo Studio', value: 'tattoo', icon: Palette, image: 'https://images.unsplash.com/photo-1605647533135-51b5906087d0?w=400' },
  { name: 'Beauty Clinic', value: 'beauty_clinic', icon: Heart, image: 'https://images.unsplash.com/photo-1544717304-a2db4a7b16ee?w=400' },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/businesses?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent to-white opacity-60"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              style={{ fontFamily: 'Outfit, sans-serif' }}
              data-testid="hero-title"
            >
              Discover & Book Your Perfect Service
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-8 leading-relaxed">
              Find the best salons, spas, and beauty services near you. Book appointments in seconds.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for services, businesses, or specialists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  data-testid="hero-search-input"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary"
                  data-testid="hero-search-button"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-12 text-center"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            data-testid="categories-title"
          >
            Browse by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.value}
                to={`/businesses?category=${category.value}`}
                className="group"
                data-testid={`category-${category.value}`}
              >
                <div className="card p-0 overflow-hidden aspect-square relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div className="text-white">
                      <category.icon className="w-5 h-5 mb-2" />
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary text-white">
        <div className="container text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-6"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Own a Business?
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Join UniBooking and reach thousands of customers looking for your services.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-secondary font-semibold rounded-xl px-8 py-4 hover:bg-accent transition-colors"
            data-testid="cta-register-business"
          >
            Register Your Business
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-200">
        <div className="container text-center">
          <p className="text-text-secondary">
            © 2026 UniBooking. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
