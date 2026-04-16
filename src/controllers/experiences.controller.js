import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getExperiences = catchAsync(async (_req, res) => {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: experiences,
  });
});
