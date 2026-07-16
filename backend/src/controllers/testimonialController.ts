import { Request, Response, NextFunction } from 'express';
import Testimonial from '../models/Testimonial';
import { ApiError } from '../utils/errors';

export const getTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminView, status } = req.query;
    const query: any = {};

    if (adminView === 'true') {
      if (status) query.status = status;
    } else {
      query.status = 'published';
    }

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      testimonials,
    });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clientName, clientRole, clientCompany, feedback, rating } = req.body;

    const testimonial = await Testimonial.create({
      clientName,
      clientRole,
      clientCompany,
      feedback,
      rating,
      status: 'pending', // Default new user testimonials to pending for approval
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Review submitted for approval.',
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!testimonial) {
      throw new ApiError(404, 'Testimonial not found');
    }

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      throw new ApiError(404, 'Testimonial not found');
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
