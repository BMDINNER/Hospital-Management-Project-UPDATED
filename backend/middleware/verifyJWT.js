import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const PROJECT_ID = process.env.PROJECT_ID;
const API_KEY = process.env.API_KEY;

const getAuthHeaders = () => ({
  'x-api-key': API_KEY,
  'x-project-id': PROJECT_ID,
  'Content-Type': 'application/json'
});

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  console.log('=== VERIFY JWT MIDDLEWARE ===');
  console.log('Auth header present:', !!authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided'
    });
  }
  
  const token = authHeader.split(' ')[1];
  console.log('Token:', token.substring(0, 30) + '...');
  
  try {
    const response = await axios.get(
      `${AUTH_SERVICE_URL}/auth/token/verify`,
      {
        headers: {
          ...getAuthHeaders(),
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('Auth service response:', response.data);
    
    const { user } = response.data;
    
    req.userId = user.userId;
    req.userEmail = user.email;
    req.user = user;
    
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    if (err.response) {
      console.error('Auth service error:', err.response.data);
    }
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Invalid or expired token'
    });
  }
};

export default verifyJWT;