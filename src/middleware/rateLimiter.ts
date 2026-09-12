import rateLimit from 'express-rate-limit';

// Standard rate limiter for public inquiry form submissions
export const leadCaptureLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 inquiries per IP in 15 minutes
  message: {
    success: false,
    message: 'Too many consultation inquiries submitted from this IP. Please wait a few moments or contact our private desk directly.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth endpoints rate limiter (login / register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
