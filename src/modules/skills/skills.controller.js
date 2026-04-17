import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.js";
import { catchAsync } from "../../common/utils/catchAsync.js";

export const getSkills = catchAsync(async (_req, res) => {
  const skills = await prisma.skill.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: skills,
  });
});
