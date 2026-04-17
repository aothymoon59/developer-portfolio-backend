import { Router } from "express";
import { getProjects } from "../controllers/projects.controller.js";
import { getSkills } from "../controllers/skills.controller.js";
import { getExperiences } from "../controllers/experiences.controller.js";
import { getEducation } from "../controllers/education.controller.js";
import { getBlogs, getBlogById } from "../controllers/blogs.controller.js";
import { getServices } from "../controllers/services.controller.js";
import { getReviews } from "../controllers/reviews.controller.js";
import { getPublicSiteSettings } from "../controllers/siteSettings.controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/portfolio/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Returns list of projects
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
 *                     $ref: '#/components/schemas/Project'
 */
router.get("/projects", getProjects);

/**
 * @swagger
 * /api/v1/portfolio/skills:
 *   get:
 *     summary: Get all skills
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Returns list of skills
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
 *                     $ref: '#/components/schemas/Skill'
 */
router.get("/skills", getSkills);

/**
 * @swagger
 * /api/v1/portfolio/experiences:
 *   get:
 *     summary: Get all experiences
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Returns list of experiences
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
 *                     $ref: '#/components/schemas/Experience'
 */
router.get("/experiences", getExperiences);

/**
 * @swagger
 * /api/v1/portfolio/education:
 *   get:
 *     summary: Get all education
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Returns list of education
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
 *                     $ref: '#/components/schemas/Education'
 */
router.get("/education", getEducation);

/**
 * @swagger
 * /api/v1/portfolio/blogs:
 *   get:
 *     summary: Get all published blogs
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Returns list of published blogs
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
 *                     $ref: '#/components/schemas/BlogPost'
 */
router.get("/blogs", getBlogs);

/**
 * @swagger
 * /api/v1/portfolio/blogs/{id}:
 *   get:
 *     summary: Get a published blog by ID
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Returns the blog post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/BlogPost'
 *       404:
 *         description: Blog not found
 */
router.get("/blogs/:id", getBlogById);

/**
 * @swagger
 * /api/v1/portfolio/services:
 *   get:
 *     summary: Get all services
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Returns list of services
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
 *                     $ref: '#/components/schemas/Service'
 */
router.get("/services", getServices);

/**
 * @swagger
 * /api/v1/portfolio/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Returns list of reviews
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
 *                     $ref: '#/components/schemas/Review'
 */
router.get("/reviews", getReviews);

/**
 * @swagger
 * /api/v1/portfolio/site-settings:
 *   get:
 *     summary: Get public site settings
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Returns public site settings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SiteSetting'
 */
router.get("/site-settings", getPublicSiteSettings);

export default router;
