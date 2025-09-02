import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  features: [{ type: String }],
  category: {
    type: String,
    default: "core",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;