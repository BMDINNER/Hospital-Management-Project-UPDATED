import express from 'express';
import * as authController from '../controllers/authController.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.post('/logout', verifyJWT, authController.logout);
router.get('/verify', verifyJWT, authController.verifyToken);
router.put('/email', verifyJWT, authController.updateEmail);
router.put('/change-password', verifyJWT, authController.changePassword);

export default router;