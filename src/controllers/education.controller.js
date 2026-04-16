import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getEducation = catchAsync(async (_req, res) => {
  const education = await prisma.education.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: education,
  });
});
