import express from 'express';
import { queryDb } from '../config/db.js';
import { EmailService } from '../services/emailService.js';

export const userRoutes = express.Router();
const mailer = new EmailService();

/**
 * Fetch a user profile by ID
 * Includes a Critical Security Flaw: SQL Injection
 */
userRoutes.get('/profile', async (req, res, next) => {
  const userId = req.query.id; // Untrusted Source
  
  // CRITICAL: Unsanitized input concatenated directly into SQL string
  const sql = `SELECT id, name, email, role FROM users WHERE id = '${userId}' AND active = true`;
  
  try {
    const data = await queryDb(sql);
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(data[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * Register a new user
 * Includes a Warning Reliability Flaw: Unhandled Promise
 */
userRoutes.post('/register', async (req, res, next) => {
  const { email, name, password } = req.body;
  
  try {
    const insertQuery = `INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id`;
    const result = await queryDb(insertQuery, [email, name]); // Properly parameterized
    
    // WARNING: Fire-and-forget async function without await or .catch()
    mailer.sendWelcomeEmail(email, name);
    
    res.status(201).json({ message: 'User created successfully', userId: result.id });
  } catch (err) {
    next(err);
  }
});
