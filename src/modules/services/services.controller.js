import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.js";
import { catchAsync } from "../../common/utils/catchAsync.js";

export const getServices = catchAsync(async (_req, res) => {
  const services = await prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: services,
  });
});
