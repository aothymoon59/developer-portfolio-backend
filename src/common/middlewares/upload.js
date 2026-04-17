import multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/ApiError.js';
import { cloudinary, configureCloudinary } from '../../config/cloudinary.js';
import { getRuntimeSystemSettings } from '../utils/systemSettings.js';

const fileFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new ApiError(StatusCodes.BAD_REQUEST, 'Only image files are allowed'));
    return;
  }

  cb(null, true);
};

export const uploadSingleImage = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).single('file');

export const createImageFieldsUpload = (fields) =>
  multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  }).fields(fields);

const uploadBufferToCloudinary = async (file, folderSuffix = '') => {
  const settings = await getRuntimeSystemSettings();
  if (!settings.cloudinaryCloudName || !settings.cloudinaryApiKey || !settings.cloudinaryApiSecret) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Cloudinary credentials are not configured');
  }

  configureCloudinary(settings);

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  return cloudinary.uploader.upload(dataUri, {
    folder: folderSuffix
      ? `${settings.cloudinaryFolder || 'developer-portfolio'}/${folderSuffix}`
      : settings.cloudinaryFolder || 'developer-portfolio',
    resource_type: 'image'
  });
};

export const mapUploadedImages = (fieldMap, folderSuffix = '') => async (req, _res, next) => {
  try {
    if (!req.files) {
      next();
      return;
    }

    for (const [fileField, targetField] of Object.entries(fieldMap)) {
      const uploadedFile = req.files[fileField]?.[0];
      if (!uploadedFile) continue;

      const uploadedAsset = await uploadBufferToCloudinary(uploadedFile, folderSuffix);
      req.body[targetField] = uploadedAsset.secure_url;
    }

    next();
  } catch (error) {
    next(error);
  }
};
