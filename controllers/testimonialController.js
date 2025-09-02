import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinaryService.js";
import Testimonial from "../models/testimonialModel.js";


// create testimonial
export const createTestimonial = async (req, res) => {
    try {
        const {name, message, title} = req.body;
        if(!name || !message || !title) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newtestimonial = new Testimonial({
            name,
            message,
            title
        })

        if(req.file){
            const folder = "testimonials";
            const image = await uploadToCloudinary([req.file], folder);
            newtestimonial.image = image[0].url;
        }

        await newtestimonial.save();
        res.status(201).json({
            success: true,
            message: "Testimonial created successfully",
            testimonial: newtestimonial
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get all testimonials
export const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Testimonials fetched successfully",
            testimonials
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//get by id
export const getTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial data not found" });
        }
        return res.status(200).json({
            message: "Testimonial data fetched successfully",
            testimonial
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// delete testimonial
export const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findByIdAndDelete(id);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial data not found" });
        }
        if(testimonial.image){
            await deleteFromCloudinary(testimonial.image);
        }   
        return res.status(200).json({
            message: "Testimonial data deleted successfully",
            testimonial
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//edit testimonial
export const editTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, message, title } = req.body;

        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial data not found" });
        }

        if(req.file){
            if(testimonial.image){
                await deleteFromCloudinary(testimonial.image);
            }
            const foldername = "testimonials";
            const file = req.file;
            const result = await uploadToCloudinary([file], foldername);
            testimonial.image = result[0].url || "";
        }

        testimonial.name = name || testimonial.name;
        testimonial.message = message || testimonial.message;
        testimonial.title = title || testimonial.title;

        await testimonial.save();
        
        return res.status(200).json({
            message: "Testimonial data updated successfully",
            testimonial
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}