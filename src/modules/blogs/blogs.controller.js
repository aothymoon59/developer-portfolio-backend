import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.js";
import { catchAsync } from "../../common/utils/catchAsync.js";

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

export const getBlogById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const blog = await prisma.blogPost.findFirst({
    where: {
      id: id,
      published: true,
    },
  });

  if (!blog) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Blog not found",
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: blog,
  });
});
