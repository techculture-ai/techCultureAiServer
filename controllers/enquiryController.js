import Enquiry from "../models/enquiryModel.js";

export const createEnquiryController = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      message = "",
      projectName = "General",
    } = req.body;

    const ip =
      req.headers["x-forwarded-for"]?.split(",").shift() ||
      req.socket?.remoteAddress ||
      null;

    let locationData = null;
    if (ip) {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      locationData = await response.json();
    }

    const enquiry = new Enquiry({
      name,
      email,
      phone,
      message,
      projectName,
      ip,
      location: locationData.city || locationData.regionName || "Unknown",
    });

    await enquiry.save();

    return res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      enquiry,
    });
  } catch (error) {
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
        const { reviewed } = req.body;
        const enquiry = await Enquiry.findByIdAndUpdate(id, {
            reviewed
        }, { new: true });
        
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