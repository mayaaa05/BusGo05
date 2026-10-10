import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public & Passenger Pages
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import BusDetails from './pages/BusDetails';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBuses from './pages/admin/AdminBuses';
import AdminRoutes from './pages/admin/AdminRoutes';
import AdminSchedules from './pages/admin/AdminSchedules';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBookings from './pages/admin/AdminBookings';
import AdminPayments from './pages/admin/AdminPayments';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
    <div className="text-6xl font-black text-orange-500">404</div>
    <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
    <p className="text-sm text-slate-500 max-w-md">
      The route you're looking for doesn't exist or has moved.
    </p>
    <a
      href="/"
      className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
    >
      Return to Home
    </a>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public and Passenger Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="bus/:id" element={<BusDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Booking flow */}
        <Route path="booking/:scheduleId" element={<BookingPage />} />
        <Route path="booking-confirmation/:bookingId" element={<BookingConfirmation />} />

        {/* Protected Passenger Routes */}
        <Route
          path="my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch all 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Protected Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="buses" element={<AdminBuses />} />
        <Route path="routes" element={<AdminRoutes />} />
        <Route path="schedules" element={<AdminSchedules />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="payments" element={<AdminPayments />} />
      </Route>
    </Routes>
  );
}

export default App;
