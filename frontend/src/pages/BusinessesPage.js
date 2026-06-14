import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { businessesAPI } from '../api';
import { MapPin, Star, Search } from 'lucide-react';
import { toast } from 'sonner';

const BusinessesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  const categories = [
    { label: 'All', value: '' },
    { label: 'Hair Salon', value: 'hair_salon' },
    { label: 'Barbershop', value: 'barbershop' },
    { label: 'Nail Salon', value: 'nail_salon' },
    { label: 'Spa & Wellness', value: 'spa' },
    { label: 'Tattoo Studio', value: 'tattoo' },
    { label: 'Beauty Clinic', value: 'beauty_clinic' },
  ];

  useEffect(() => {
    loadBusinesses();
  }, [searchParams]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchParams.get('search')) params.search = searchParams.get('search');
      if (searchParams.get('category')) params.category = searchParams.get('category');

      const data = await businessesAPI.list(params);
      setBusinesses(data);
    } catch (error) {
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    setSearchParams(params);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (category) params.category = category;
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        {/* Search & Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl"
                data-testid="businesses-search-input"
              />
            </div>
          </form>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-200 text-text-secondary hover:border-primary'
                }`}
                data-testid={`category-filter-${cat.value || 'all'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-text-secondary">Loading businesses...</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-16" data-testid="no-businesses-message">
            <p className="text-xl text-text-secondary">No businesses found</p>
            <p className="text-text-muted mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Link
                key={business.id}
                to={`/businesses/${business.id}`}
                className="card overflow-hidden group"
                data-testid={`business-card-${business.id}`}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={business.cover_image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600'}
                    alt={business.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {business.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{business.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{Number(business.average_rating).toFixed(1)}</span>
                    </div>
                    <span className="text-text-muted text-sm">({business.total_reviews} reviews)</span>
                  </div>
                  <div className="mt-3 inline-block px-3 py-1 bg-accent rounded-full text-xs font-medium text-secondary capitalize">
                    {business.category.replace('_', ' ')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessesPage;
