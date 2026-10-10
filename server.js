const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '.env') });

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const seedData = require('./utils/seedData');
const User = require('./models/User');

// Route imports
const authRoutes = require('./routes/authRoutes');
const busRoutes = require('./routes/busRoutes');
const routeRoutes = require('./routes/routeRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    database: {
      connected: isConnected,
      status: isConnected ? 'Connected to MongoDB' : 'Connecting/Disconnected',
      host: mongoose.connection.host || '127.0.0.1',
      port: mongoose.connection.port || 27017,
      name: mongoose.connection.name || 'busgo',
    },
    service: 'BusGo API',
    tagline: 'Travel Anywhere, Anytime.',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Reseed demo data endpoint
app.post('/api/reseed', async (req, res) => {
  try {
    await seedData(false);
    res.json({ success: true, message: 'Database successfully re-seeded with 16 distinct buses and diverse schedules!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Serve static frontend in production
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// Client-side routing fallback (for all non-API routes)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) next();
  });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚡ Empty database detected. Auto-seeding initial demo data...');
      await seedData(true);
      console.log('✅ Demo data auto-seeded successfully!');
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 BusGo Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}/api/health`);
    });

    return server;
  } catch (error) {
    console.error('Fatal Server Error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
// Server restarted after freeing port 5000
