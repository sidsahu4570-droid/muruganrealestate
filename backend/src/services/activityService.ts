import { Request } from 'express';
import ActivityLog from '../models/ActivityLog';
import mongoose from 'mongoose';

export const logActivity = async (
  userId: string | mongoose.Types.ObjectId | undefined,
  action: string,
  details?: string,
  req?: Request
) => {
  try {
    const ipAddress = req?.ip || (req?.headers['x-forwarded-for'] as string) || '';
    const userAgent = req?.headers['user-agent'] || '';

    await ActivityLog.create({
      user: userId,
      action,
      details,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
