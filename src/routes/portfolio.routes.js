import { Router } from 'express';
import { getPortfolioData } from '../controllers/portfolio.controller.js';

const router = Router();

/**
 * @swagger
 * /api/v1/portfolio:
 *   get:
 *     summary: Public portfolio data
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Returns portfolio content
 */
router.get('/', getPortfolioData);

export default router;
