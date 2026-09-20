import express from 'express';
import { queryDb } from '../config/db.js';

export const productRoutes = express.Router();

/**
 * Fetch products by category
 */
productRoutes.get('/', async (req, res, next) => {
  const category = req.query.category;
  const limit = parseInt(req.query.limit) || 10;
  
  // FIX: Using parameterized inputs to prevent SQL Injection
  const sql = `SELECT * FROM products WHERE category = $1 LIMIT $2`;
  
  try {
    const data = await queryDb(sql, [category, limit]);
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
    const sql = `SELECT * FROM products WHERE id = $1`;
    const data = await queryDb(sql, [productId]);
    
    if (data.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(data[0]);
  } catch (err) {
    next(err);
  }
});
