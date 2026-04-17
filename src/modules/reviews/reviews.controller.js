import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.js";
import { catchAsync } from "../../common/utils/catchAsync.js";

export const getReviews = catchAsync(async (_req, res) => {
  const reviews = await prisma.review.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: reviews,
  });
});
