import mongoose from "mongoose";

const enquirySchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  projectName: {
    type: String,
    required: true,
    default: "General",
  },
  createdAt: {
    type: Date,
    default: new Date(),
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

const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;