import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ensureUniqueSlug } from "../utils/slug.js";
import { getRuntimeSystemSettings } from "../utils/systemSettings.js";

const defaultSiteSetting = {
  siteTitle: "Developer Portfolio",
  footerCopyright: "All rights reserved.",
  phoneNumbers: [],
  emailAddresses: [],
};

const withPublishedTimestamp = (payload, existingBlog = null) => {
  const nextPayload = { ...payload };

  if (payload.published) {
    nextPayload.publishedAt = existingBlog?.publishedAt || existingBlog?.createdAt || new Date();
  } else {
    nextPayload.publishedAt = null;
  }

  return nextPayload;
};

const pick = (source, keys) =>
  keys.reduce((result, key) => {
    result[key] =
      source?.[key] ?? (Array.isArray(defaultSiteSetting[key]) ? [] : "");
    return result;
  }, {});

const getPagination = (req) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildPaginationMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
});

const getOrCreateSiteSetting = async () => {
  const existing = await prisma.siteSetting.findFirst();
  if (existing) return existing;

  return prisma.siteSetting.create({ data: defaultSiteSetting });
};

const ensureEntity = async (delegate, id, entityName) => {
  const entity = await delegate.findUnique({ where: { id } });
  if (!entity) {
    throw new ApiError(StatusCodes.NOT_FOUND, `${entityName} not found`);
  }

  return entity;
};

export const getDashboardStats = catchAsync(async (_req, res) => {
  const [
    projects,
    skills,
    experiences,
    education,
    messages,
    blogs,
    recentProjects,
    recentBlogs,
    recentMessages,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.experience.count(),
    prisma.education.count(),
    prisma.contactMessage.count(),
    prisma.blogPost.count(),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true, featured: true },
    }),
    prisma.blogPost.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, published: true, createdAt: true },
    }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        createdAt: true,
        status: true,
      },
    }),
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      stats: { projects, skills, experiences, education, messages, blogs },
      recentProjects,
      recentBlogs,
      recentMessages,
    },
  });
});

export const getHomeContent = catchAsync(async (_req, res) => {
  const siteSetting = await getOrCreateSiteSetting();

  res.status(StatusCodes.OK).json({
    success: true,
    data: pick(siteSetting, [
      "fullName",
      "jobTitle",
      "homeDescription",
      "heroTitle",
      "heroSubtitle",
    ]),
  });
});

export const updateHomeContent = catchAsync(async (req, res) => {
  const siteSetting = await getOrCreateSiteSetting();
  const updated = await prisma.siteSetting.update({
    where: { id: siteSetting.id },
    data: req.validated.body,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: pick(updated, [
      "fullName",
      "jobTitle",
      "homeDescription",
      "heroTitle",
      "heroSubtitle",
    ]),
  });
});

export const getAboutContent = catchAsync(async (_req, res) => {
  const [siteSetting, services, reviews] = await Promise.all([
    getOrCreateSiteSetting(),
    prisma.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.review.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      content: pick(siteSetting, [
        "aboutTitle",
        "aboutDescription",
        // "aboutDetails",
        "aboutImageUrl",
        // "aboutImageLgUrl",
        "cvUrl",
      ]),
      services,
      reviews,
    },
  });
});

export const updateAboutContent = catchAsync(async (req, res) => {
  const siteSetting = await getOrCreateSiteSetting();
  const updated = await prisma.siteSetting.update({
    where: { id: siteSetting.id },
    data: req.validated.body,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: pick(updated, [
      "aboutTitle",
      "aboutDescription",
      // 'aboutDetails',
      "aboutImageUrl",
      // 'aboutImageLgUrl',
      "cvUrl",
    ]),
  });
});

export const createService = catchAsync(async (req, res) => {
  const service = await prisma.service.create({ data: req.validated.body });
  res.status(StatusCodes.CREATED).json({ success: true, data: service });
});

export const updateService = catchAsync(async (req, res) => {
  await ensureEntity(prisma.service, req.params.id, "Service");
  const service = await prisma.service.update({
    where: { id: req.params.id },
    data: req.validated.body,
  });
  res.status(StatusCodes.OK).json({ success: true, data: service });
});

export const deleteService = catchAsync(async (req, res) => {
  await ensureEntity(prisma.service, req.params.id, "Service");
  await prisma.service.delete({ where: { id: req.params.id } });
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Service deleted successfully" });
});

export const createReview = catchAsync(async (req, res) => {
  const review = await prisma.review.create({ data: req.validated.body });
  res.status(StatusCodes.CREATED).json({ success: true, data: review });
});

export const updateReview = catchAsync(async (req, res) => {
  await ensureEntity(prisma.review, req.params.id, "Review");
  const review = await prisma.review.update({
    where: { id: req.params.id },
    data: req.validated.body,
  });
  res.status(StatusCodes.OK).json({ success: true, data: review });
});

export const deleteReview = catchAsync(async (req, res) => {
  await ensureEntity(prisma.review, req.params.id, "Review");
  await prisma.review.delete({ where: { id: req.params.id } });
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Review deleted successfully" });
});

export const getResumeContent = catchAsync(async (_req, res) => {
  const [skills, experiences, education] = await Promise.all([
    prisma.skill.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.experience.findMany({
      orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
    }),
    prisma.education.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: { skills, experiences, education },
  });
});

export const createSkill = catchAsync(async (req, res) => {
  const skill = await prisma.skill.create({ data: req.validated.body });
  res.status(StatusCodes.CREATED).json({ success: true, data: skill });
});

export const updateSkill = catchAsync(async (req, res) => {
  await ensureEntity(prisma.skill, req.params.id, "Skill");
  const skill = await prisma.skill.update({
    where: { id: req.params.id },
    data: req.validated.body,
  });
  res.status(StatusCodes.OK).json({ success: true, data: skill });
});

export const deleteSkill = catchAsync(async (req, res) => {
  await ensureEntity(prisma.skill, req.params.id, "Skill");
  await prisma.skill.delete({ where: { id: req.params.id } });
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Skill deleted successfully" });
});

export const createExperience = catchAsync(async (req, res) => {
  const experience = await prisma.experience.create({
    data: req.validated.body,
  });
  res.status(StatusCodes.CREATED).json({ success: true, data: experience });
});

export const updateExperience = catchAsync(async (req, res) => {
  await ensureEntity(prisma.experience, req.params.id, "Experience");
  const experience = await prisma.experience.update({
    where: { id: req.params.id },
    data: req.validated.body,
  });
  res.status(StatusCodes.OK).json({ success: true, data: experience });
});

export const deleteExperience = catchAsync(async (req, res) => {
  await ensureEntity(prisma.experience, req.params.id, "Experience");
  await prisma.experience.delete({ where: { id: req.params.id } });
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Experience deleted successfully" });
});

export const createEducation = catchAsync(async (req, res) => {
  const education = await prisma.education.create({ data: req.validated.body });
  res.status(StatusCodes.CREATED).json({ success: true, data: education });
});

export const updateEducation = catchAsync(async (req, res) => {
  await ensureEntity(prisma.education, req.params.id, "Education");
  const education = await prisma.education.update({
    where: { id: req.params.id },
    data: req.validated.body,
  });
  res.status(StatusCodes.OK).json({ success: true, data: education });
});

export const deleteEducation = catchAsync(async (req, res) => {
  await ensureEntity(prisma.education, req.params.id, "Education");
  await prisma.education.delete({ where: { id: req.params.id } });
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Education deleted successfully" });
});

export const getProjects = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const [items, total] = await Promise.all([
    prisma.project.findMany({
      skip,
      take: limit,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.project.count(),
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: items,
    meta: buildPaginationMeta(page, limit, total),
  });
});

export const getProjectById = catchAsync(async (req, res) => {
  const project = await ensureEntity(prisma.project, req.params.id, "Project");
  res.status(StatusCodes.OK).json({ success: true, data: project });
});

export const createProject = catchAsync(async (req, res) => {
  const slug = await ensureUniqueSlug(
    prisma.project,
    req.validated.body.title,
    req.validated.body.slug,
  );
  const project = await prisma.project.create({
    data: {
      ...req.validated.body,
      slug,
    },
  });
  res.status(StatusCodes.CREATED).json({ success: true, data: project });
});

export const updateProject = catchAsync(async (req, res) => {
  await ensureEntity(prisma.project, req.params.id, "Project");
  const slug = await ensureUniqueSlug(
    prisma.project,
    req.validated.body.title,
    req.validated.body.slug,
    req.params.id,
  );
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: {
      ...req.validated.body,
      slug,
    },
  });
  res.status(StatusCodes.OK).json({ success: true, data: project });
});

export const deleteProject = catchAsync(async (req, res) => {
  await ensureEntity(prisma.project, req.params.id, "Project");
  await prisma.project.delete({ where: { id: req.params.id } });
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Project deleted successfully" });
});

export const getBlogs = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      skip,
      take: limit,
      orderBy: [{ createdAt: "desc" }],
    }),
    prisma.blogPost.count(),
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: items,
    meta: buildPaginationMeta(page, limit, total),
  });
});

export const getBlogById = catchAsync(async (req, res) => {
  const blog = await ensureEntity(prisma.blogPost, req.params.id, "Blog");
  res.status(StatusCodes.OK).json({ success: true, data: blog });
});

export const createBlog = catchAsync(async (req, res) => {
  const slug = await ensureUniqueSlug(
    prisma.blogPost,
    req.validated.body.title,
    req.validated.body.slug,
  );
  const createdBlog = await prisma.blogPost.create({
    data: {
      ...req.validated.body,
      slug,
    },
  });
  const blog = req.validated.body.published
    ? await prisma.blogPost.update({
        where: { id: createdBlog.id },
        data: { publishedAt: createdBlog.createdAt },
      })
    : createdBlog;
  res.status(StatusCodes.CREATED).json({ success: true, data: blog });
});

export const updateBlog = catchAsync(async (req, res) => {
  const existingBlog = await ensureEntity(prisma.blogPost, req.params.id, "Blog");
  const slug = await ensureUniqueSlug(
    prisma.blogPost,
    req.validated.body.title,
    req.validated.body.slug,
    req.params.id,
  );
  const blog = await prisma.blogPost.update({
    where: { id: req.params.id },
    data: {
      ...withPublishedTimestamp(req.validated.body, existingBlog),
      slug,
    },
  });
  res.status(StatusCodes.OK).json({ success: true, data: blog });
});

export const deleteBlog = catchAsync(async (req, res) => {
  await ensureEntity(prisma.blogPost, req.params.id, "Blog");
  await prisma.blogPost.delete({ where: { id: req.params.id } });
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Blog deleted successfully" });
});

export const getMessages = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.count(),
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: items,
    meta: buildPaginationMeta(page, limit, total),
  });
});

export const getSiteSetting = catchAsync(async (_req, res) => {
  const siteSetting = await getOrCreateSiteSetting();
  res.status(StatusCodes.OK).json({ success: true, data: siteSetting });
});

export const updateSiteSetting = catchAsync(async (req, res) => {
  const siteSetting = await getOrCreateSiteSetting();
  const updated = await prisma.siteSetting.update({
    where: { id: siteSetting.id },
    data: req.validated.body,
  });

  res.status(StatusCodes.OK).json({ success: true, data: updated });
});

export const getSystemSetting = catchAsync(async (_req, res) => {
  const settings = await getRuntimeSystemSettings();
  res.status(StatusCodes.OK).json({
    success: true,
    data: pick(settings, [
      "cloudinaryCloudName",
      "cloudinaryApiKey",
      "cloudinaryApiSecret",
      "cloudinaryFolder",
      "faviconUrl",
      "footerCopyright",
      "smtpHost",
      "smtpPort",
      "smtpSecure",
      "smtpUser",
      "smtpPass",
      "mailFrom",
      "adminNotificationEmail",
    ]),
  });
});

export const updateSystemSetting = catchAsync(async (req, res) => {
  const siteSetting = await getOrCreateSiteSetting();
  const updated = await prisma.siteSetting.update({
    where: { id: siteSetting.id },
    data: req.validated.body,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: pick(updated, [
      "cloudinaryCloudName",
      "cloudinaryApiKey",
      "cloudinaryApiSecret",
      "cloudinaryFolder",
      "faviconUrl",
      "footerCopyright",
      "smtpHost",
      "smtpPort",
      "smtpSecure",
      "smtpUser",
      "smtpPass",
      "mailFrom",
      "adminNotificationEmail",
    ]),
  });
});
