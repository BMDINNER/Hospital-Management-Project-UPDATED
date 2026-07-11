import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const PROJECT_ID = process.env.PROJECT_ID;
const API_KEY = process.env.API_KEY;

const getAuthHeaders = () => ({
  'x-api-key': API_KEY,
  'x-project-id': PROJECT_ID,
  'Content-Type': 'application/json'
});

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/project/login`,
      { email, password, projectId: PROJECT_ID },
      { headers: getAuthHeaders() }
    );
    
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ success: false, message });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/project/register`,
      { email, password, username, projectId: PROJECT_ID },
      { headers: getAuthHeaders() }
    );
    
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ success: false, message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/refresh`,
      { refreshToken },
      { headers: getAuthHeaders() }
    );
    
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ success: false, message });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/logout`,
      { refreshToken },
      { 
        headers: {
          ...getAuthHeaders(),
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ success: false, message });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const response = await axios.get(
      `${AUTH_SERVICE_URL}/auth/token/verify`,
      { 
        headers: {
          ...getAuthHeaders(),
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 401;
    const message = error.response?.data?.message || 'Invalid token';
    res.status(status).json({ success: false, message });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!newEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'New email and password are required'
      });
    }

    const response = await axios.put(
      `${AUTH_SERVICE_URL}/auth/email`,
      { newEmail, password },
      {
        headers: {
          ...getAuthHeaders(),
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ success: false, message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const response = await axios.put(
      `${AUTH_SERVICE_URL}/auth/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          ...getAuthHeaders(),
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ success: false, message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/forgot-password`,
      { email },
      { headers: getAuthHeaders() }
    );
    
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ success: false, message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/reset-password`,
      { token, newPassword },
      { headers: getAuthHeaders() }
    );
    
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ success: false, message });
  }
};