import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from '../utils/errors';

export const uploadMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !(req.files as Express.Multer.File[]).length) {
      throw new ApiError(400, 'No files uploaded');
    }

    const files = req.files as Express.Multer.File[];

    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'realestate' },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error('Upload failed'));
            } else {
              resolve(result.secure_url);
            }
          }
        );
        stream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      urls,
    });
  } catch (error) {
    next(error);
  }
};
