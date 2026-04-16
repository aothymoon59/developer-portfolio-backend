import { StatusCodes } from 'http-status-codes';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';

export const protect = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized'));
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

  if (!user || !user.isActive) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid user'));
  }

  req.user = user;
  next();
};
