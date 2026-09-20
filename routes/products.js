import express from 'express';
import { queryDb } from '../config/db.js';

export const productRoutes = express.Router();

/**
 * Fetch products by category
 * Identical SQL Injection flaw to users.js (Must be grouped by the AI)
 */
productRoutes.get('/', async (req, res, next) => {
  const category = req.query.category; // Untrusted Source
  const limit = parseInt(req.query.limit) || 10;
  
  // CRITICAL: Unsanitized input concatenated directly into SQL string
  const sql = `SELECT * FROM products WHERE category = '${category}' LIMIT ${limit}`;
  
  try {
    const data = await queryDb(sql);
    res.status(200).json({
      count: data.length,
      results: data,
      metadata: { requestedCategory: category }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get product details
 */
productRoutes.get('/:id', async (req, res, next) => {
  const productId = req.params.id;
  
  try {
    // Correctly parameterized query (Strength)
    const sql = `SELECT * FROM products WHERE id = $1`;
    const data = await queryDb(sql, [productId]);
    
    if (data.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(data[0]);
  } catch (err) {
    next(err);
  }
});
