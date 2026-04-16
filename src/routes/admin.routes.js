import { Router } from 'express';
import { createProject, getDashboardStats, updateSiteSetting } from '../controllers/admin.controller.js';
import { getMessages } from '../controllers/message.controller.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { projectSchema, siteSettingSchema } from './schemas.js';

const router = Router();

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.get('/dashboard', protect, getDashboardStats);
router.get('/messages', protect, getMessages);
router.put('/site-settings', protect, validate(siteSettingSchema), updateSiteSetting);
router.post('/projects', protect, validate(projectSchema), createProject);

export default router;
