import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getPublicSiteSettings = catchAsync(async (_req, res) => {
  const siteSetting = await prisma.siteSetting.findFirst({
    select: {
      siteTitle: true,
      logoUrl: true,
      faviconUrl: true,
      footerCopyright: true,
      fullName: true,
      jobTitle: true,
      homeDescription: true,
      heroTitle: true,
      heroSubtitle: true,
      aboutTitle: true,
      aboutDescription: true,
      aboutDetails: true,
      aboutText: true,
      aboutImageUrl: true,
      aboutImageLgUrl: true,
      cvUrl: true,
      githubUrl: true,
      linkedinUrl: true,
      facebookUrl: true,
      twitterUrl: true,
      instagramUrl: true,
      youtubeUrl: true,
      email: true,
      phone: true,
      phoneNumbers: true,
      emailAddresses: true,
      location: true,
      contactDescription: true,
    },
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: siteSetting,
  });
});
