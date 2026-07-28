import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { expireAppointments } from './services/appointmentService.js';
import './expireAppointments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3005', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/hospital', hospitalRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected');
    
    setInterval(async () => {
      try {
        const count = await expireAppointments();
        if (count > 0) {
          console.log(`Expired ${count} appointments`);
        }
      } catch (error) {
        console.error('Scheduler error:', error);
      }
    }, 15000);
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();