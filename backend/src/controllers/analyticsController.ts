import { Request, Response, NextFunction } from 'express';
import Property from '../models/Property';
import Lead from '../models/Lead';
import Enquiry from '../models/Enquiry';
import User from '../models/User';

export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayLeads = await Lead.countDocuments({ createdAt: { $gte: todayStart } });
    const todayEnquiries = await Enquiry.countDocuments({ createdAt: { $gte: todayStart } });

    const totalProperties = await Property.countDocuments();
    const availableProperties = await Property.countDocuments({ status: 'available' });
    const soldProperties = await Property.countDocuments({ status: 'sold' });
    const featuredProperties = await Property.countDocuments({ status: 'featured' });

    const monthlyRevenue = 145000;
    const websiteVisitors = 12500;
    const activeUsers = await User.countDocuments({ status: 'active' });

    res.status(200).json({
      success: true,
      summary: {
        totalLeads,
        todayLeads,
        todayEnquiries,
        totalProperties,
        availableProperties,
        soldProperties,
        featuredProperties,
        monthlyRevenue,
        websiteVisitors,
        activeUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsGraphs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertyViews = [
      { name: 'Jan', views: 2400 },
      { name: 'Feb', views: 1398 },
      { name: 'Mar', views: 9800 },
      { name: 'Apr', views: 3908 },
      { name: 'May', views: 4800 },
      { name: 'Jun', views: 3800 },
      { name: 'Jul', views: 4300 },
    ];

    const leadConversion = [
      { name: 'New', value: Math.max(1, await Lead.countDocuments({ status: 'new' })) },
      { name: 'Contacted', value: Math.max(1, await Lead.countDocuments({ status: 'contacted' })) },
      { name: 'Site Visit', value: Math.max(1, await Lead.countDocuments({ status: 'site_visit' })) },
      { name: 'Negotiation', value: Math.max(0, await Lead.countDocuments({ status: 'negotiation' })) },
      { name: 'Won', value: Math.max(1, await Lead.countDocuments({ status: 'won' })) },
      { name: 'Lost', value: Math.max(0, await Lead.countDocuments({ status: 'lost' })) },
    ];

    const categoryDistribution = [
      { name: 'Villas', value: 40 },
      { name: 'Penthouses', value: 30 },
      { name: 'Apartments', value: 20 },
      { name: 'Plots', value: 10 },
    ];

    const revenueAnalytics = [
      { name: 'Jan', revenue: 4000 },
      { name: 'Feb', revenue: 3000 },
      { name: 'Mar', revenue: 2000 },
      { name: 'Apr', revenue: 2780 },
      { name: 'May', revenue: 1890 },
      { name: 'Jun', revenue: 2390 },
      { name: 'Jul', revenue: 3490 },
    ];

    res.status(200).json({
      success: true,
      propertyViews,
      leadConversion,
      categoryDistribution,
      revenueAnalytics,
    });
  } catch (error) {
    next(error);
  }
};

export const exportReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await Lead.find({});
    let csv = 'Name,Email,Phone,Source,Status,Created At\n';
    leads.forEach((l) => {
      csv += `"${l.name}","${l.email}","${l.phone || ''}","${l.source || ''}","${l.status}","${(l as any).createdAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_report.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
