import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  createdAt:{
    type: Date,
    default: Date.now,
  }
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
