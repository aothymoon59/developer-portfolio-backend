import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';

import { prisma } from '../../config/prisma.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { catchAsync } from '../../common/utils/catchAsync.js';
import { signToken } from '../../common/utils/jwt.js';

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.validated.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const isMatched = await bcrypt.compare(password, user.passwordHash);
  if (!isMatched) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const token = signToken({ userId: user.id, role: user.role });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
});

export const me = catchAsync(async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});
