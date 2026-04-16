import { StatusCodes } from 'http-status-codes';
import { prisma } from '../config/prisma.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendAdminContactNotification } from '../utils/mailer.js';

export const createMessage = catchAsync(async (req, res) => {
  const message = await prisma.contactMessage.create({ data: req.validated.body });
  await sendAdminContactNotification(req.validated.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Message sent successfully',
    data: message
  });
});

export const getMessages = catchAsync(async (_req, res) => {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });

  res.status(StatusCodes.OK).json({ success: true, data: messages });
});
