import { StatusCodes } from 'http-status-codes';
import { env } from '../../config/env.js';
import { cloudinary } from '../../config/cloudinary.js';
import { catchAsync } from '../../common/utils/catchAsync.js';

export const uploadImage = catchAsync(async (req, res) => {
  if (!req.file) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Image file is required'
    });
    return;
  }

  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Cloudinary credentials are not configured'
    });
    return;
  }

  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const uploadedAsset = await cloudinary.uploader.upload(dataUri, {
    folder: env.cloudinaryFolder,
    resource_type: 'image'
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: {
      fileName: uploadedAsset.public_id,
      originalName: req.file.originalname,
      url: uploadedAsset.secure_url
    }
  });
});
