import { StatusCodes } from 'http-status-codes';
import { prisma } from '../config/prisma.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getDashboardStats = catchAsync(async (_req, res) => {
  const [projects, skills, messages, blogs] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.contactMessage.count(),
    prisma.blogPost.count()
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: { projects, skills, messages, blogs }
  });
});

export const updateSiteSetting = catchAsync(async (req, res) => {
  const existing = await prisma.siteSetting.findFirst();

  const siteSetting = existing
    ? await prisma.siteSetting.update({ where: { id: existing.id }, data: req.validated.body })
    : await prisma.siteSetting.create({ data: req.validated.body });

  res.status(StatusCodes.OK).json({ success: true, data: siteSetting });
});

export const createProject = catchAsync(async (req, res) => {
  const project = await prisma.project.create({ data: req.validated.body });
  res.status(StatusCodes.CREATED).json({ success: true, data: project });
});
