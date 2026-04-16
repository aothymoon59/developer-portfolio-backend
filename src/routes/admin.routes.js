import { Router } from 'express';
import {
  createBlog,
  createEducation,
  createExperience,
  createProject,
  createReview,
  createService,
  createSkill,
  deleteBlog,
  deleteEducation,
  deleteExperience,
  deleteProject,
  deleteReview,
  deleteService,
  deleteSkill,
  getAboutContent,
  getBlogById,
  getBlogs,
  getDashboardStats,
  getHomeContent,
  getMessages,
  getProjectById,
  getProjects,
  getResumeContent,
  getSiteSetting,
  getSystemSetting,
  updateAboutContent,
  updateBlog,
  updateEducation,
  updateExperience,
  updateHomeContent,
  updateProject,
  updateReview,
  updateService,
  updateSiteSetting,
  updateSystemSetting,
  updateSkill
} from '../controllers/admin.controller.js';
import { uploadImage } from '../controllers/upload.controller.js';
import { protect } from '../middlewares/auth.js';
import {
  normalizeBlogMultipart,
  normalizeProjectMultipart,
  normalizeServiceMultipart,
  normalizeSettingsMultipart
} from '../middlewares/multipart.js';
import {
  createImageFieldsUpload,
  mapUploadedImages,
  uploadSingleImage
} from '../middlewares/upload.js';
import { validate } from '../middlewares/validate.js';
import {
  aboutContentSchema,
  blogSchema,
  educationSchema,
  experienceSchema,
  homeContentSchema,
  projectSchema,
  reviewSchema,
  serviceSchema,
  siteSettingSchema,
  systemSettingSchema,
  skillSchema
} from './schemas.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Authenticated admin content management endpoints
 * components:
 *   schemas:
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         totalPages:
 *           type: integer
 *     LinkItem:
 *       type: object
 *       properties:
 *         label:
 *           type: string
 *         url:
 *           type: string
 *           format: uri
 *     HomeContent:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *         jobTitle:
 *           type: string
 *         homeDescription:
 *           type: string
 *         heroTitle:
 *           type: string
 *         heroSubtitle:
 *           type: string
 *     AboutContent:
 *       type: object
 *       properties:
 *         aboutTitle:
 *           type: string
 *         aboutDescription:
 *           type: string
 *         aboutDetails:
 *           type: string
 *         aboutImageUrl:
 *           type: string
 *         aboutImageLgUrl:
 *           type: string
 *         cvUrl:
 *           type: string
 *     Service:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         imageUrl:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         sortOrder:
 *           type: integer
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         review:
 *           type: string
 *         rating:
 *           type: integer
 *         reviewerName:
 *           type: string
 *         reviewerTitle:
 *           type: string
 *         officeName:
 *           type: string
 *         sortOrder:
 *           type: integer
 *     Skill:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         level:
 *           type: integer
 *         icon:
 *           type: string
 *         sortOrder:
 *           type: integer
 *     Experience:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         company:
 *           type: string
 *         position:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         isCurrent:
 *           type: boolean
 *         description:
 *           type: string
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *         sortOrder:
 *           type: integer
 *     Education:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         institute:
 *           type: string
 *         degree:
 *           type: string
 *         fieldOfStudy:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         grade:
 *           type: string
 *         description:
 *           type: string
 *         sortOrder:
 *           type: integer
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         subTitle:
 *           type: string
 *         summary:
 *           type: string
 *         description:
 *           type: string
 *         imageUrl:
 *           type: string
 *         liveUrl:
 *           type: string
 *         frontendRepoUrl:
 *           type: string
 *         backendRepoUrl:
 *           type: string
 *         additionalLinks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LinkItem'
 *         featured:
 *           type: boolean
 *         sortOrder:
 *           type: integer
 *         technology:
 *           type: array
 *           items:
 *             type: string
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *     Blog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         subTitle:
 *           type: string
 *         excerpt:
 *           type: string
 *         content:
 *           type: string
 *         coverImage:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         published:
 *           type: boolean
 *         publishedAt:
 *           type: string
 *           format: date-time
 *     SiteSetting:
 *       type: object
 *       properties:
 *         siteTitle:
 *           type: string
 *         logoUrl:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         location:
 *           type: string
 *         contactDescription:
 *           type: string
 *         phoneNumbers:
 *           type: array
 *           items:
 *             type: string
 *         emailAddresses:
 *           type: array
 *           items:
 *             type: string
 *         githubUrl:
 *           type: string
 *         linkedinUrl:
 *           type: string
 *         facebookUrl:
 *           type: string
 *         twitterUrl:
 *           type: string
 *         instagramUrl:
 *           type: string
 *         youtubeUrl:
 *           type: string
 */

router.use(protect);

/**
 * @swagger
 * /api/v1/admin/upload:
 *   post:
 *     summary: Upload an image asset for admin content
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 */
router.post('/upload', uploadSingleImage, uploadImage);

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics and recent activity
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data returned successfully
 */
router.get('/dashboard', getDashboardStats);

/**
 * @swagger
 * /api/v1/admin/home:
 *   get:
 *     summary: Get home page admin content
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Update home page admin content
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HomeContent'
 */
router.get('/home', getHomeContent);
router.put('/home', validate(homeContentSchema), updateHomeContent);

/**
 * @swagger
 * /api/v1/admin/about:
 *   get:
 *     summary: Get about page admin content
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Update about page admin content
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AboutContent'
 */
router.get('/about', getAboutContent);
router.put(
  '/about',
  createImageFieldsUpload([
    { name: 'aboutImage', maxCount: 1 },
    { name: 'aboutImageLg', maxCount: 1 }
  ]),
  mapUploadedImages(
    {
      aboutImage: 'aboutImageUrl',
      aboutImageLg: 'aboutImageLgUrl'
    },
    'about'
  ),
  validate(aboutContentSchema),
  updateAboutContent
);
router.post(
  '/about/services',
  createImageFieldsUpload([{ name: 'image', maxCount: 1 }]),
  mapUploadedImages({ image: 'imageUrl' }, 'services'),
  normalizeServiceMultipart,
  validate(serviceSchema),
  createService
);
router.put(
  '/about/services/:id',
  createImageFieldsUpload([{ name: 'image', maxCount: 1 }]),
  mapUploadedImages({ image: 'imageUrl' }, 'services'),
  normalizeServiceMultipart,
  validate(serviceSchema),
  updateService
);
router.delete('/about/services/:id', deleteService);
router.post('/about/reviews', validate(reviewSchema), createReview);
router.put('/about/reviews/:id', validate(reviewSchema), updateReview);
router.delete('/about/reviews/:id', deleteReview);

/**
 * @swagger
 * /api/v1/admin/resume:
 *   get:
 *     summary: Get resume data for skills, experience, and education
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/resume', getResumeContent);
router.post('/resume/skills', validate(skillSchema), createSkill);
router.put('/resume/skills/{id}', validate(skillSchema), updateSkill);
router.delete('/resume/skills/{id}', deleteSkill);
router.post('/resume/experiences', validate(experienceSchema), createExperience);
router.put('/resume/experiences/{id}', validate(experienceSchema), updateExperience);
router.delete('/resume/experiences/{id}', deleteExperience);
router.post('/resume/education', validate(educationSchema), createEducation);
router.put('/resume/education/{id}', validate(educationSchema), updateEducation);
router.delete('/resume/education/{id}', deleteEducation);

/**
 * @swagger
 * /api/v1/admin/projects:
 *   get:
 *     summary: Get paginated admin projects
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create a project
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 */
router.get('/projects', getProjects);
router.post(
  '/projects',
  createImageFieldsUpload([{ name: 'image', maxCount: 1 }]),
  mapUploadedImages({ image: 'imageUrl' }, 'projects'),
  normalizeProjectMultipart,
  validate(projectSchema),
  createProject
);
router.get('/projects/:id', getProjectById);
router.put(
  '/projects/:id',
  createImageFieldsUpload([{ name: 'image', maxCount: 1 }]),
  mapUploadedImages({ image: 'imageUrl' }, 'projects'),
  normalizeProjectMultipart,
  validate(projectSchema),
  updateProject
);
router.delete('/projects/:id', deleteProject);

/**
 * @swagger
 * /api/v1/admin/blogs:
 *   get:
 *     summary: Get paginated admin blogs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create a blog post
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 */
router.get('/blogs', getBlogs);
router.post(
  '/blogs',
  createImageFieldsUpload([{ name: 'coverImageFile', maxCount: 1 }]),
  mapUploadedImages({ coverImageFile: 'coverImage' }, 'blogs'),
  normalizeBlogMultipart,
  validate(blogSchema),
  createBlog
);
router.get('/blogs/:id', getBlogById);
router.put(
  '/blogs/:id',
  createImageFieldsUpload([{ name: 'coverImageFile', maxCount: 1 }]),
  mapUploadedImages({ coverImageFile: 'coverImage' }, 'blogs'),
  normalizeBlogMultipart,
  validate(blogSchema),
  updateBlog
);
router.delete('/blogs/:id', deleteBlog);

/**
 * @swagger
 * /api/v1/admin/messages:
 *   get:
 *     summary: Get paginated contact messages
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/messages', getMessages);

/**
 * @swagger
 * /api/v1/admin/settings:
 *   get:
 *     summary: Get site settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Update site settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SiteSetting'
 */
router.get('/settings', getSiteSetting);
router.put(
  '/settings',
  createImageFieldsUpload([{ name: 'logo', maxCount: 1 }]),
  mapUploadedImages({ logo: 'logoUrl' }, 'settings'),
  normalizeSettingsMultipart,
  validate(siteSettingSchema),
  updateSiteSetting
);
router.get('/system-settings', getSystemSetting);
router.put('/system-settings', validate(systemSettingSchema), updateSystemSetting);

export default router;
