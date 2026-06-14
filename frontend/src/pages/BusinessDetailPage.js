import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { businessesAPI, servicesAPI, appointmentsAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Clock, Phone, Mail, Globe, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const BusinessDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [businessData, servicesData] = await Promise.all([
        businessesAPI.get(id),
        servicesAPI.list(id),
      ]);
      setBusiness(businessData);
      setServices(servicesData);
    } catch (error) {
      toast.error('Failed to load business details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (service) => {
    if (!user) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!appointmentDate || !appointmentTime) {
      toast.error('Please select date and time');
      return;
    }

    try {
      setBooking(true);
      await appointmentsAPI.create({
        business_id: business.id,
        service_id: selectedService.id,
        appointment_date: appointmentDate,
        start_time: appointmentTime,
        customer_notes: notes,
      });
      toast.success('Appointment booked successfully!');
      setShowBookingModal(false);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 text-center">
          <p className="text-xl text-text-secondary">Business not found</p>
        </div>
      </div>
    );
  }

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        {/* Business Header */}
        <div className="card p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-accent rounded-full text-sm font-medium text-secondary capitalize mb-3">
                  {business.category.replace('_', ' ')}
                </span>
              </div>
              <h1
                className="text-4xl font-bold mb-4"
                style={{ fontFamily: 'Outfit, sans-serif' }}
                data-testid="business-name"
              >
                {business.name}
              </h1>
              <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                {business.description || 'No description available'}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-text-secondary">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{business.address}, {business.city}</span>
                </div>
                {business.phone && (
                  <div className="flex items-center gap-3 text-text-secondary">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>{business.phone}</span>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center gap-3 text-text-secondary">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>{business.email}</span>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center gap-3 text-text-secondary">
                    <Globe className="w-5 h-5 text-primary" />
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      {business.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {business.cover_image_url && (
              <div className="md:col-span-1">
                <img
                  src={business.cover_image_url}
                  alt={business.name}
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="card p-8">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            data-testid="services-title"
          >
            Services
          </h2>

          {services.length === 0 ? (
            <p className="text-text-secondary">No services available</p>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center p-4 bg-background rounded-xl hover:shadow-sm transition-shadow"
                  data-testid={`service-${service.id}`}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                    {service.description && (
                      <p className="text-text-secondary text-sm mb-2">{service.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration_minutes} min</span>
                      </div>
                      <span className="font-semibold text-primary text-lg">
                        ${Number(service.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBookService(service)}
                    className="btn-primary ml-4"
                    data-testid={`book-service-${service.id}`}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div>
              <p className="text-sm text-text-secondary mb-2">Service</p>
              <p className="font-semibold">{selectedService?.name}</p>
              <p className="text-sm text-text-muted">
                {selectedService?.duration_minutes} min • ${Number(selectedService?.price || 0).toFixed(2)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={minDate}
                required
                className="w-full"
                data-testid="booking-date-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
                className="w-full"
                data-testid="booking-time-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests?"
                rows={3}
                className="w-full"
                data-testid="booking-notes-input"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="flex-1 btn-outline"
                data-testid="booking-cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={booking}
                className="flex-1 btn-primary disabled:opacity-50"
                data-testid="booking-confirm-button"
              >
                {booking ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessDetailPage;
