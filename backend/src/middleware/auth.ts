import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';
import User, { IUser } from '../models/User';
import { ApiError } from '../utils/errors';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access token is required');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.userId);
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    if (user.status !== 'active') {
      throw new ApiError(403, 'Account is suspended or inactive');
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired'));
    }
    next(new ApiError(401, 'Invalid or expired access token'));
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'User context not set'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to access this resource'));
    }

    next();
  };
};
