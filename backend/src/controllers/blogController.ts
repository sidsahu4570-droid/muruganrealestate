import { Request, Response, NextFunction } from 'express';
import Blog from '../models/Blog';
import { ApiError } from '../utils/errors';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, tag, adminView, status } = req.query;
    const query: any = {};

    if (adminView === 'true') {
      if (status) query.status = status;
    } else {
      query.status = 'published';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { content: { $regex: search as string, $options: 'i' } },
      ];
    }

    if (tag) {
      query.tags = tag as string;
    }

    const blogs = await Blog.find(query)
      .populate({ path: 'author', select: 'name avatar' })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminView } = req.query;
    const query: any = { slug: req.params.slug };

    if (adminView !== 'true') {
      query.status = 'published';
    }

    const blog = await Blog.findOne(query)
      .populate({ path: 'author', select: 'name avatar' });

    if (!blog) {
      throw new ApiError(404, 'Blog article not found');
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = { ...req.body };
    if (!payload.slug) {
      payload.slug = slugify(payload.title) + '-' + Math.floor(100 + Math.random() * 900);
    }
    if (!payload.author && (req as any).user?._id) {
      payload.author = (req as any).user._id;
    }

    const newBlog = await Blog.create(payload);
    res.status(201).json({
      success: true,
      blog: newBlog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) throw new ApiError(404, 'Blog article not found');

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) throw new ApiError(404, 'Blog article not found');

    res.status(200).json({
      success: true,
      message: 'Blog article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
