import mongoose from "mongoose";

const enquirySchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
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