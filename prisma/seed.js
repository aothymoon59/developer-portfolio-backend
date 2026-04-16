import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin12345', 10);

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      passwordHash,
      role: 'SUPER_ADMIN'
    }
  });

  const existingSettings = await prisma.siteSetting.findFirst();
  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
        siteTitle: 'Developer Portfolio',
        logoUrl: '/images/brand-image.jpg',
        fullName: 'Md Saidul Islam',
        jobTitle: 'Senior Software Developer',
        homeDescription:
          '<p>Senior PHP-Laravel Web Application Developer with 5+ years of experience building scalable, secure, and high-performance systems.</p>',
        heroTitle: 'I build modern web experiences',
        heroSubtitle: 'Software Engineer | Web Developer',
        aboutTitle: 'About Me',
        aboutDescription: '<p>Experienced full-stack developer focused on scalable products, strong architecture, and reliable delivery.</p>',
        aboutDetails:
          '<p>I lead teams, design scalable architectures, and build products across ERP, POS, RMS, marketplace, and AI-assisted workflows.</p>',
        aboutText: 'This is a starter content entry for your portfolio website.',
        aboutImageUrl: '/images/about-image.jpg',
        aboutImageLgUrl: '/images/about-image-lg.jpg',
        githubUrl: 'https://github.com/aothymoon59',
        linkedinUrl: 'https://www.linkedin.com',
        email: 'admin@example.com'
      }
    });
  }

  const serviceCount = await prisma.service.count();
  if (!serviceCount) {
    await prisma.service.createMany({
      data: [
        {
          imageUrl: '/images/portfolio-image-1.jpg',
          title: 'Frontend Development',
          description:
            'Build modern, responsive user interfaces with React.js, clean component architecture, and strong UX focus.',
          sortOrder: 1
        },
        {
          imageUrl: '/images/portfolio-image-2.jpg',
          title: 'Backend Development',
          description:
            'Develop secure APIs, scalable services, and database-driven systems for complex business applications.',
          sortOrder: 2
        }
      ]
    });
  }

  const reviewCount = await prisma.review.count();
  if (!reviewCount) {
    await prisma.review.createMany({
      data: [
        {
          review:
            'Excellent problem-solving skills and a strong ability to deliver polished frontend experiences on time.',
          rating: 5,
          reviewerName: 'Riadus Salehin',
          reviewerTitle: 'Senior Software Engineer',
          officeName: 'Seopage1',
          sortOrder: 1
        },
        {
          review:
            'Reliable, detail-oriented, and very effective when translating business requirements into production-ready features.',
          rating: 5,
          reviewerName: 'Iqbal Hasan',
          reviewerTitle: 'Technical Lead Engineer',
          officeName: 'Bdtask',
          sortOrder: 2
        }
      ]
    });
  }

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
