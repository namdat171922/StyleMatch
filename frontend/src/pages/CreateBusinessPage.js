import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { businessesAPI } from '../api';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';

const CreateBusinessPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'hair_salon',
    address: '',
    city: '',
    country: 'Singapore',
    postal_code: '',
    phone: '',
    email: '',
    website: '',
  });

  const categories = [
    { label: 'Hair Salon', value: 'hair_salon' },
    { label: 'Barbershop', value: 'barbershop' },
    { label: 'Nail Salon', value: 'nail_salon' },
    { label: 'Spa & Wellness', value: 'spa' },
    { label: 'Tattoo Studio', value: 'tattoo' },
    { label: 'Beauty Clinic', value: 'beauty_clinic' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const business = await businessesAPI.create(formData);
      toast.success('Business created successfully!');
      navigate(`/businesses/${business.id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-8 h-8 text-primary" />
              <h1
                className="text-3xl font-bold"
                style={{ fontFamily: 'Outfit, sans-serif' }}
                data-testid="create-business-title"
              >
                Register Your Business
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="name">
                  Business Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                  data-testid="business-name-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="category">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full"
                  data-testid="business-category-select"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full"
                  placeholder="Tell customers about your business..."
                  data-testid="business-description-input"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="address">
                    Address *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full"
                    data-testid="business-address-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="city">
                    City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full"
                    data-testid="business-city-input"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="postal_code">
                    Postal Code
                  </label>
                  <input
                    id="postal_code"
                    name="postal_code"
                    type="text"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full"
                    data-testid="business-postal-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full"
                    data-testid="business-phone-input"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="email">
                    Business Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full"
                    data-testid="business-email-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="website">
                    Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="https://"
                    data-testid="business-website-input"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 btn-outline"
                  data-testid="create-business-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50"
                  data-testid="create-business-submit"
                >
                  {loading ? 'Creating...' : 'Create Business'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBusinessPage;
