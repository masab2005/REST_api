import rateLimit from 'express-rate-limit';
// Trust the proxy (required for correct IP detection on Railway and for express-rate-limit)
app.set('trust proxy', true);

// Create a limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 8, // 5 requests per windowMs per IP
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: 'Too many login attempts, please try again after 5 minutes'
  }
});

// Create a general API limiter (less strict)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests, please try again after 15 minutes'
  }
});
