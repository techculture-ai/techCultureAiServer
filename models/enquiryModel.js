import mongoose from "mongoose";

const enquirySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true,
    default: ""
  },
  ip: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: "Unknown"
  },
  demoDate: {
    type: Date,
    default: null,
  },
  demoTime: {
    type: String,
    default: null, 
  },
  timezone: {
    type: String,
    default: "Asia/Kolkata", // Default to Indian timezone
  },
  projectName: {
    type: String,
    required: true,
    default: "General",
    trim: true
  },
  reviewed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for better query performance
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ email: 1 });
enquirySchema.index({ reviewed: 1 });

const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;