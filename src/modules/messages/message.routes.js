import { Router } from 'express';
import { createMessage } from './message.controller.js';
import { validate } from '../../common/middlewares/validate.js';
import { contactMessageSchema } from './message.schema.js';

const router = Router();

/**
 * @swagger
 * /api/v1/messages:
 *   post:
 *     summary: Submit contact form message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactMessage'
 *     responses:
 *       201:
 *         description: Message created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ContactMessage'
 */
router.post('/', validate(contactMessageSchema), createMessage);

export default router;
