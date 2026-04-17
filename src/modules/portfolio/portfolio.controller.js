import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/prisma.js';
import { catchAsync } from '../../common/utils/catchAsync.js';

export const getPortfolioData = catchAsync(async (_req, res) => {
  const [siteSetting, projects, skills, experiences, education, blogs, services, reviews] = await Promise.all([
    prisma.siteSetting.findFirst(),
    prisma.project.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }),
    prisma.skill.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }),
    prisma.experience.findMany({ orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }] }),
    prisma.education.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' } }),
    prisma.service.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }),
    prisma.review.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] })
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: { siteSetting, projects, skills, experiences, education, blogs, services, reviews }
  });
});
