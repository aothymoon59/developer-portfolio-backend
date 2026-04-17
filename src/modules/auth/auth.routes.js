import { Router } from 'express';
import { login, me } from './auth.controller.js';
import { protect } from '../../common/middlewares/auth.js';
import { validate } from '../../common/middlewares/validate.js';
import { loginSchema } from './auth.schema.js';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 * /api/v1/auth/me:
 *   get:
 *     summary: Get authenticated admin profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, me);

export default router;
