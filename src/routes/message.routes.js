import { Router } from 'express';
import { createMessage } from '../controllers/message.controller.js';
import { validate } from '../middlewares/validate.js';
import { contactMessageSchema } from './schemas.js';

const router = Router();

/**
 * @swagger
 * /api/v1/messages:
 *   post:
 *     summary: Submit contact form message
 *     tags: [Messages]
 *     responses:
 *       201:
 *         description: Message created
 */
router.post('/', validate(contactMessageSchema), createMessage);

export default router;
