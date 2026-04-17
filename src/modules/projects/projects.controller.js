import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.js";
import { catchAsync } from "../../common/utils/catchAsync.js";

export const getProjects = catchAsync(async (_req, res) => {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: projects,
  });
});
