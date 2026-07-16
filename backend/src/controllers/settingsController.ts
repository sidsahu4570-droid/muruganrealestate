import { Request, Response, NextFunction } from 'express';
import Settings from '../models/Settings';

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        siteName: 'Aurelia Luxury Estates',
        contactEmail: 'concierge@aureliaestates.com',
        contactPhone: '+1 (800) 555-GOLD',
        whatsappNumber: '15557898455',
        socialLinks: {
          facebook: 'https://facebook.com/aurelia',
          twitter: 'https://twitter.com/aurelia',
          instagram: 'https://instagram.com/aurelia',
          linkedin: 'https://linkedin.com/company/aurelia',
        },
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    Object.assign(settings, req.body);
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Global configuration settings updated successfully',
      settings,
    });
  } catch (error) {
    next(error);
  }
};
