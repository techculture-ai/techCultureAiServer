import Enquiry from "../models/enquiryModel.js";
import demoScheduleConfirmationEmailTemp from "../utils/demoTempEmail.js";
import { sendEmail } from "../config/emailService.js";

export const createEnquiryController = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      message = "",
      projectName = "General",
      demoDate,
      demoTime,
      timezone = "Asia/Kolkata", // Default to Indian timezone
    } = req.body;

    const ip =
      req.headers["x-forwarded-for"]?.split(",").shift() ||
      req.socket?.remoteAddress ||
      null;

    let locationData = null;
    if (ip && ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        locationData = await response.json();
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    }

    const enquiry = new Enquiry({
      name,
      email,
      phone,
      message,
      projectName,
      demoDate: demoDate || null,
      demoTime: demoTime || null,
      timezone: timezone,
      ip,
      location: locationData?.city || locationData?.regionName || "Unknown",
    });

    await enquiry.save();

    // Only send demo confirmation email if demo details are provided
    if (demoDate && demoTime) {
      try {
        const emailHtml = demoScheduleConfirmationEmailTemp({
          userName: name,
          userEmail: email,
          userPhone: phone,
          companyName: projectName,
          demoDate: new Date(demoDate),
          demoTime: demoTime,
          timezone: timezone,
          meetingLink: "https://meet.google.com/your-meeting-link", // Replace with actual meeting link
          meetingId: enquiry._id.toString().slice(-6), // Use last 6 chars of ID as meeting ID
          demoNotes: message,
        });

        await sendEmail({
          sendTo: email,
          subject: "Demo Scheduled Successfully - TechCulture AI",
          text: "",
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Don't fail the entire request if email fails
      }
    }

    return res.status(201).json({
      success: true,
      message: demoDate && demoTime 
        ? "Demo scheduled successfully! Confirmation email sent." 
        : "Enquiry created successfully",
      enquiry,
    });
  } catch (error) {
    console.error("Error in createEnquiryController:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllEnquiriesController = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "Enquiries fetched successfully",
            enquiries
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getEnquiryByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const enquiry = await Enquiry.findById(id);
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Enquiry fetched successfully",
            enquiry
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteEnquiryController = async (req, res) => {
    try {
        const { id } = req.params;
        const enquiry = await Enquiry.findByIdAndDelete(id);
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Enquiry deleted successfully",
            enquiry
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateEnquiryController = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const enquiry = await Enquiry.findByIdAndUpdate(id, updateData, { 
            new: true,
            runValidators: true 
        });
        
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        
        return res.status(200).json({
            success: true,
            message: "Enquiry updated successfully",
            enquiry
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}