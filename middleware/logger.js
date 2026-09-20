/**
 * Request logging middleware
 * Includes a Maintainability Flaw (Dead code and unused variables)
 */
export const logRequest = (req, res, next) => {
  const start = Date.now();
  
  // OPTIMIZATION (Maintainability): Unused variables and dead code
  const unusedSessionId = req.headers['x-session-id'] || 'anonymous';
  const deprecatedFeatureFlag = process.env.ENABLE_LEGACY_LOGGING === 'true';
  let calculationBuffer = null;
  
  if (deprecatedFeatureFlag) {
    calculationBuffer = Buffer.alloc(1024);
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[System Error] ${err.message}`);
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An internal server error occurred' 
    : err.message;
    
  res.status(statusCode).json({
    error: message,
    referenceId: `ERR-${Date.now()}`
  });
};
