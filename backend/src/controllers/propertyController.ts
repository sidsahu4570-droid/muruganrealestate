import { Request, Response, NextFunction } from 'express';
import Property from '../models/Property';
import Category from '../models/Category';
import City from '../models/City';
import { ApiError } from '../utils/errors';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const getProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search,
      category,
      city,
      listingType,
      minPrice,
      maxPrice,
      beds,
      baths,
      status,
      adminView,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query: any = {};

    if (adminView === 'true') {
      if (status) query.status = status;
    } else {
      query.status = { $in: ['available', 'upcoming', 'featured', 'premium', 'trending'] };
      if (status) query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    if (category) {
      const cat = await Category.findOne({ slug: category as string });
      if (cat) query.category = cat._id;
    }

    if (city) {
      const ct = await City.findOne({ slug: city as string });
      if (ct) query.city = ct._id;
    }

    if (listingType) {
      query.listingType = listingType as string;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (beds) {
      query['specs.beds'] = { $gte: Number(beds) };
    }
    if (baths) {
      query['specs.baths'] = { $gte: Number(baths) };
    }

    let sortQuery: any = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortQuery = { price: 1 };
    } else if (sort === 'price-desc') {
      sortQuery = { price: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);

    const properties = await Property.find(query)
      .populate('category')
      .populate('city')
      .populate('location')
      .populate({ path: 'agent', select: 'name email phone avatar' })
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug })
      .populate('category')
      .populate('city')
      .populate('location')
      .populate({ path: 'agent', select: 'name email phone avatar' });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = { ...req.body };
    if (!payload.slug) {
      payload.slug = slugify(payload.title) + '-' + Math.floor(1000 + Math.random() * 9000);
    }
    if (!payload.agent && (req as any).user?._id) {
      payload.agent = (req as any).user._id;
    }

    const newProperty = await Property.create(payload);
    res.status(201).json({
      success: true,
      property: newProperty,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!property) throw new ApiError(404, 'Property not found');

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) throw new ApiError(404, 'Property not found');

    res.status(200).json({
      success: true,
      message: 'Property listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const duplicateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const original = await Property.findById(req.params.id);
    if (!original) throw new ApiError(404, 'Original listing not found');

    const copyObj = original.toObject() as any;
    delete copyObj._id;
    delete copyObj.createdAt;
    delete copyObj.updatedAt;

    copyObj.title = `${copyObj.title} (Copy)`;
    copyObj.slug = `${copyObj.slug}-copy-${Math.floor(100 + Math.random() * 900)}`;
    copyObj.status = 'available';

    const duplicate = await Property.create(copyObj);

    res.status(201).json({
      success: true,
      property: duplicate,
    });
  } catch (error) {
    next(error);
  }
};
