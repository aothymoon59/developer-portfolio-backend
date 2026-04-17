import { Router } from "express";
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
  replyToMessage,
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
  updateSkill,
} from "./admin.controller.js";
import { uploadImage } from "../upload/upload.controller.js";
import { protect } from "../../common/middlewares/auth.js";
import {
  normalizeBlogMultipart,
  normalizeProjectMultipart,
  normalizeServiceMultipart,
  normalizeSettingsMultipart,
} from "../../common/middlewares/multipart.js";
import {
  createImageFieldsUpload,
  mapUploadedImages,
  uploadSingleImage,
} from "../../common/middlewares/upload.js";
import { validate } from "../../common/middlewares/validate.js";
import {
  aboutContentSchema,
  blogSchema,
  educationSchema,
  experienceSchema,
  homeContentSchema,
  projectSchema,
  replyMessageSchema,
  reviewSchema,
  serviceSchema,
  siteSettingSchema,
  systemSettingSchema,
  skillSchema,
} from "./admin.schema.js";

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
 *         department:
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
 *         faviconUrl:
 *           type: string
 *         footerCopyright:
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
router.post("/upload", uploadSingleImage, uploadImage);

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
router.get("/dashboard", getDashboardStats);

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
router.get("/home", getHomeContent);
router.put("/home", validate(homeContentSchema), updateHomeContent);

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
router.get("/about", getAboutContent);
router.put(
  "/about",
  createImageFieldsUpload([
    { name: "aboutImage", maxCount: 1 },
    { name: "aboutImageLg", maxCount: 1 },
  ]),
  mapUploadedImages(
    {
      aboutImage: "aboutImageUrl",
      aboutImageLg: "aboutImageLgUrl",
    },
    "about",
  ),
  validate(aboutContentSchema),
  updateAboutContent,
);
router.post(
  "/about/services",
  createImageFieldsUpload([{ name: "image", maxCount: 1 }]),
  mapUploadedImages({ image: "imageUrl" }, "services"),
  normalizeServiceMultipart,
  validate(serviceSchema),
  createService,
);
/**
 * @swagger
 * /api/v1/admin/about/services:
 *   post:
 *     summary: Create a service item
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service created
 */
router.put(
  "/about/services/:id",
  createImageFieldsUpload([{ name: "image", maxCount: 1 }]),
  mapUploadedImages({ image: "imageUrl" }, "services"),
  normalizeServiceMultipart,
  validate(serviceSchema),
  updateService,
);
/**
 * @swagger
 * /api/v1/admin/about/services/{id}:
 *   put:
 *     summary: Update a service item
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service updated
 *   delete:
 *     summary: Delete a service item
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted
 */
router.delete("/about/services/:id", deleteService);
/**
 * @swagger
 * /api/v1/admin/about/reviews:
 *   post:
 *     summary: Create a review item
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created
 */
router.post("/about/reviews", validate(reviewSchema), createReview);
/**
 * @swagger
 * /api/v1/admin/about/reviews/{id}:
 *   put:
 *     summary: Update a review item
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review updated
 *   delete:
 *     summary: Delete a review item
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.put("/about/reviews/:id", validate(reviewSchema), updateReview);
router.delete("/about/reviews/:id", deleteReview);

/**
 * @swagger
 * /api/v1/admin/resume:
 *   get:
 *     summary: Get resume data for skills, experience, and education
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get("/resume", getResumeContent);
/**
 * @swagger
 * /api/v1/admin/resume/skills:
 *   post:
 *     summary: Create a skill
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Skill created
 */
router.post("/resume/skills", validate(skillSchema), createSkill);
/**
 * @swagger
 * /api/v1/admin/resume/skills/{id}:
 *   put:
 *     summary: Update a skill
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Delete a skill
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put("/resume/skills/:id", validate(skillSchema), updateSkill);
router.delete("/resume/skills/:id", deleteSkill);
/**
 * @swagger
 * /api/v1/admin/resume/experiences:
 *   post:
 *     summary: Create an experience record
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Experience created
 */
router.post(
  "/resume/experiences",
  validate(experienceSchema),
  createExperience,
);
/**
 * @swagger
 * /api/v1/admin/resume/experiences/{id}:
 *   put:
 *     summary: Update an experience record
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Delete an experience record
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put(
  "/resume/experiences/:id",
  validate(experienceSchema),
  updateExperience,
);
router.delete("/resume/experiences/:id", deleteExperience);
/**
 * @swagger
 * /api/v1/admin/resume/education:
 *   post:
 *     summary: Create an education record
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Education created
 */
router.post("/resume/education", validate(educationSchema), createEducation);
/**
 * @swagger
 * /api/v1/admin/resume/education/{id}:
 *   put:
 *     summary: Update an education record
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Delete an education record
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put("/resume/education/:id", validate(educationSchema), updateEducation);
router.delete("/resume/education/:id", deleteEducation);

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
router.get("/projects", getProjects);
router.post(
  "/projects",
  createImageFieldsUpload([{ name: "image", maxCount: 1 }]),
  mapUploadedImages({ image: "imageUrl" }, "projects"),
  normalizeProjectMultipart,
  validate(projectSchema),
  createProject,
);
router.get("/projects/:id", getProjectById);
/**
 * @swagger
 * /api/v1/admin/projects/{id}:
 *   get:
 *     summary: Get an admin project by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Update a project
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete a project
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/projects/:id",
  createImageFieldsUpload([{ name: "image", maxCount: 1 }]),
  mapUploadedImages({ image: "imageUrl" }, "projects"),
  normalizeProjectMultipart,
  validate(projectSchema),
  updateProject,
);
router.delete("/projects/:id", deleteProject);

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
router.get("/blogs", getBlogs);
router.post(
  "/blogs",
  createImageFieldsUpload([{ name: "coverImageFile", maxCount: 1 }]),
  mapUploadedImages({ coverImageFile: "coverImage" }, "blogs"),
  normalizeBlogMultipart,
  validate(blogSchema),
  createBlog,
);
router.get("/blogs/:id", getBlogById);
/**
 * @swagger
 * /api/v1/admin/blogs/{id}:
 *   get:
 *     summary: Get an admin blog by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Update a blog post
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/blogs/:id",
  createImageFieldsUpload([{ name: "coverImageFile", maxCount: 1 }]),
  mapUploadedImages({ coverImageFile: "coverImage" }, "blogs"),
  normalizeBlogMultipart,
  validate(blogSchema),
  updateBlog,
);
router.delete("/blogs/:id", deleteBlog);

/**
 * @swagger
 * /api/v1/admin/messages:
 *   get:
 *     summary: Get paginated contact messages
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paginated contact messages returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContactMessage'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 */
router.get("/messages", getMessages);
/**
 * @swagger
 * /api/v1/admin/messages/{id}/reply:
 *   post:
 *     summary: Send a reply email to a contact message sender
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReplyMessage'
 *     responses:
 *       200:
 *         description: Reply sent successfully
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
router.post("/messages/:id/reply", validate(replyMessageSchema), replyToMessage);

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
router.get("/settings", getSiteSetting);
router.put(
  "/settings",
  createImageFieldsUpload([{ name: "logo", maxCount: 1 }]),
  mapUploadedImages({ logo: "logoUrl" }, "settings"),
  normalizeSettingsMultipart,
  validate(siteSettingSchema),
  updateSiteSetting,
);
/**
 * @swagger
 * /api/v1/admin/system-settings:
 *   get:
 *     summary: Get system settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System settings returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SystemSetting'
 *   put:
 *     summary: Update system settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System settings updated
 */
router.get("/system-settings", getSystemSetting);
router.put(
  "/system-settings",
  createImageFieldsUpload([{ name: "favicon", maxCount: 1 }]),
  mapUploadedImages({ favicon: "faviconUrl" }, "settings"),
  validate(systemSettingSchema),
  updateSystemSetting,
);

export default router;
