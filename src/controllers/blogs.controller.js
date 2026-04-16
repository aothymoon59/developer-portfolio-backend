import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getBlogs = catchAsync(async (_req, res) => {
  const blogs = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: blogs,
  });
});
