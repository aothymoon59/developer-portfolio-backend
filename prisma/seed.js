import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin12345",
    10,
  );

  console.log("Creating admin user...");
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@example.com" },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || "Admin User",
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("Admin user created/checked");

  console.log("Seeding site settings...");
  const existingSettings = await prisma.siteSetting.findFirst();
  if (!existingSettings) {
    console.log("Creating new site settings...");
    await prisma.siteSetting.create({
      data: {
        siteTitle: "Developer Portfolio",
        logoUrl: "/images/brand-image.jpg",
        faviconUrl: "/favicon.ico",
        footerCopyright: "All rights reserved.",
        fullName: "Aothy Mahamud Moon",
        jobTitle: "Software Developer",
        homeDescription:
          "<p>Senior PHP-Laravel Web Application Developer with 5+ years of experience building scalable, secure, and high-performance systems.</p>",
        heroTitle: "I build modern web experiences",
        heroSubtitle: "Software Engineer | Web Developer",
        aboutTitle: "About Me",
        aboutDescription:
          "<p>Experienced full-stack developer focused on scalable products, strong architecture, and reliable delivery.</p>",
        aboutDetails:
          "<p>I lead teams, design scalable architectures, and build products across ERP, POS, RMS, marketplace, and AI-assisted workflows.</p>",
        aboutText:
          "This is a starter content entry for your portfolio website.",
        // Cloudinary Configuration
        cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
        cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
        cloudinaryFolder:
          process.env.CLOUDINARY_FOLDER || "developer-portfolio",
        // SMTP Configuration
        smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
        smtpPort: Number(process.env.SMTP_PORT || 465),
        smtpSecure: process.env.SMTP_SECURE === "true",
        smtpUser: process.env.SMTP_USER || "",
        smtpPass: process.env.SMTP_PASS || "",
        mailFrom: process.env.MAIL_FROM || process.env.SMTP_USER || "",
        adminNotificationEmail:
          process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || "",
      },
    });
  } else {
    // Update existing settings with env vars
    console.log("Updating existing site settings with env vars...");
    await prisma.siteSetting.update({
      where: { id: existingSettings.id },
      data: {
        cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || undefined,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || undefined,
        cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || undefined,
        cloudinaryFolder:
          process.env.CLOUDINARY_FOLDER || "developer-portfolio",
        smtpHost: process.env.SMTP_HOST || undefined,
        smtpPort: Number(process.env.SMTP_PORT || 465),
        smtpSecure: process.env.SMTP_SECURE === "true",
        smtpUser: process.env.SMTP_USER || undefined,
        smtpPass: process.env.SMTP_PASS || undefined,
        mailFrom: process.env.MAIL_FROM || undefined,
        adminNotificationEmail:
          process.env.ADMIN_NOTIFICATION_EMAIL || undefined,
      },
    });
  }
  console.log("Site settings completed");

  console.log("Seeding services...");
  const serviceCount = await prisma.service.count();
  if (!serviceCount) {
    console.log("Creating services...");
    await prisma.service.createMany({
      data: [
        {
          imageUrl: "/images/portfolio-image-1.jpg",
          title: "Frontend Development",
          description:
            "Build modern, responsive user interfaces with React.js, clean component architecture, and strong UX focus.",
          sortOrder: 1,
        },
        {
          imageUrl: "/images/portfolio-image-2.jpg",
          title: "Backend Development",
          description:
            "Develop secure APIs, scalable services, and database-driven systems for complex business applications.",
          sortOrder: 2,
        },
      ],
    });
    console.log("Services created");
  } else {
    console.log(`Services already exist (${serviceCount} records)`);
  }

  console.log("✅ Seed completed successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
