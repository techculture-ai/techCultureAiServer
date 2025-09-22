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
    default: "main",
  },
  showOnHomePage: {
    type: Boolean,
    default: false,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  order: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

serviceSchema.index({ category: 1 });
serviceSchema.index({ order: 1 });
serviceSchema.index({ updatedAt: 1 });

const Service = mongoose.model("Service", serviceSchema);
export default Service;
