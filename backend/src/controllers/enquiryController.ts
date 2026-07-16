import { Request, Response, NextFunction } from 'express';
import Enquiry from '../models/Enquiry';
import Lead from '../models/Lead';
import { logActivity } from '../services/activityService';
import { sendEmail } from '../config/mail';
import { ApiError } from '../utils/errors';

export const createEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, propertyId, message } = req.body;

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      property: propertyId || undefined,
      message,
      status: 'new',
    });

    // Automatically create a corresponding lead in the CRM pipeline
    await Lead.create({
      name,
      email,
      phone,
      source: 'enquiry',
      status: 'new',
      notesList: [
        {
          note: `Website enquiry: "${message}"`,
          author: 'System',
          createdAt: new Date(),
        },
      ],
      timeline: [
        {
          action: 'Lead Created',
          details: 'Converted from customer web contact form submission',
          createdAt: new Date(),
        },
      ],
    });

    await logActivity(undefined, 'Enquiry Submitted', `New enquiry from ${name} (${email})`, req);

    // Send confirmation email to client
    try {
      await sendEmail(
        email,
        'Inquiry Received - Aurelia Luxury Estates',
        `<p>Dear ${name},</p>
         <p>We have successfully received your inquiry regarding our luxury portfolio.</p>
         <blockquote>"${message}"</blockquote>
         <p>A bespoke transaction advisor will contact you within 24 hours.</p>
         <br/>
         <p>Warm regards,</p>
         <p><b>Aurelia Concierge Advisory</b></p>`
      );
    } catch (err) {
      console.error('Nodemailer verification skip or transport failed:', err);
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. Our sales team will get in touch.',
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const enquiries = await Enquiry.find().populate('property').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      enquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const replyToEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      throw new ApiError(404, 'Enquiry not found');
    }

    enquiry.replies.push({
      message,
      senderName: (req as any).user?.name || 'Admin Concierge',
      createdAt: new Date(),
    });
    enquiry.status = 'replied';

    await enquiry.save();

    // Send email reply to customer
    try {
      await sendEmail(
        enquiry.email,
        'Regarding Your Inquiry - Aurelia Luxury Estates',
        `<p>Dear ${enquiry.name},</p>
         <p>Thank you for your interest in our premium real estate listings. Our advisor has replied to your request:</p>
         <div style="border-left: 3px solid #C9A227; padding-left: 10px; font-style: italic; color: #555;">
           ${message}
         </div>
         <p>If you have any further questions, please reply directly to this email or speak to us on WhatsApp.</p>
         <br/>
         <p>Sincerely,</p>
         <p><b>Aurelia Concierge Advisory Team</b></p>`
      );
    } catch (err) {
      console.error('Failed to send nodemailer reply dispatch:', err);
    }

    res.status(200).json({
      success: true,
      message: 'Reply successfully registered and sent via mailer',
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      throw new ApiError(404, 'Enquiry not found');
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
