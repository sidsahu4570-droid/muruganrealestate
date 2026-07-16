import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import User from '../models/User';
import { ApiError } from '../utils/errors';

export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, status, source, assignedTo, page = '1', limit = '10' } = req.query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (assignedTo) filter.assignedTo = assignedTo;

    const p = parseInt(page as string, 10);
    const l = parseInt(limit as string, 10);

    const leads = await Lead.find(filter)
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l);

    const total = await Lead.countDocuments(filter);

    res.status(200).json({
      success: true,
      leads,
      total,
      pages: Math.ceil(total / l),
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email role');
    if (!lead) throw new ApiError(404, 'Lead not found');

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, source, status, assignedTo, note } = req.body;

    const notesList = note ? [{ note, author: (req as any).user?.name || 'System', createdAt: new Date() }] : [];

    const lead = await Lead.create({
      name,
      email,
      phone,
      source: source || 'direct',
      status: status || 'new',
      assignedTo,
      notesList,
      timeline: [{ action: 'Lead Created', details: `Created via backend interface` }],
    });

    res.status(201).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, status, assignedTo } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new ApiError(404, 'Lead not found');

    const statusChanged = status && lead.status !== status;
    const assignedChanged = assignedTo && String(lead.assignedTo) !== String(assignedTo);

    if (name) lead.name = name;
    if (email) lead.email = email;
    if (phone !== undefined) lead.phone = phone;
    if (status) lead.status = status;
    if (assignedTo !== undefined) lead.assignedTo = assignedTo;

    if (statusChanged) {
      lead.timeline.push({ action: 'Status Updated', details: `Shifted to ${status}` });
    }
    if (assignedChanged) {
      const exec = await User.findById(assignedTo);
      lead.timeline.push({ action: 'Lead Assigned', details: `Assigned to ${exec?.name || 'Unassigned'}` });
    }

    await lead.save();

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) throw new ApiError(404, 'Lead not found');

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const addLeadNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { note } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new ApiError(404, 'Lead not found');

    lead.notesList.push({
      note,
      author: (req as any).user?.name || 'Admin',
      createdAt: new Date(),
    });
    lead.timeline.push({ action: 'Note Added', details: note.slice(0, 50) });

    await lead.save();

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

export const addLeadReminder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { time, note } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new ApiError(404, 'Lead not found');

    lead.reminders.push({
      time: new Date(time),
      note,
      isCompleted: false,
    });
    lead.timeline.push({ action: 'Reminder Scheduled', details: `${note} at ${new Date(time).toLocaleDateString()}` });

    await lead.save();

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesExecutives = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const executives = await User.find({
      role: { $in: ['admin', 'sales_executive', 'super_admin'] },
      status: 'active',
    }).select('name email role');

    res.status(200).json({
      success: true,
      executives,
    });
  } catch (error) {
    next(error);
  }
};
