import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { appointmentsAPI } from '../api';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsAPI.list({ upcoming: true });
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <div className="mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            data-testid="dashboard-title"
          >
            My Dashboard
          </h1>
          <p className="text-text-secondary">Welcome back, {user?.full_name}!</p>
        </div>

        {/* Appointments Section */}
        <div className="card p-8">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            data-testid="upcoming-appointments-title"
          >
            Upcoming Appointments
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-3 text-text-secondary">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8" data-testid="no-appointments-message">
              <Calendar className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-lg text-text-secondary">No upcoming appointments</p>
              <p className="text-text-muted mt-1">Book your first service to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 bg-background rounded-xl border border-gray-200"
                  data-testid={`appointment-${appointment.id}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{format(new Date(appointment.appointment_date), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{appointment.start_time} - {appointment.end_time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
