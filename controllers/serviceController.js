import Service from "../models/serviceModel.js";
import {deleteFromCloudinary,uploadToCloudinary} from "../config/cloudinaryService.js"
import { cleanupAfterUpload } from "../utils/cleanupTempFiles.js";

//create 
export const createService = async (req, res) => {
  const { title, description, features = [], category="core" } = req.body;
  try {

    if(!title || !description || !features) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
    const service = await Service.create({
      title,
      description,
      features: parsedFeatures,
      category,
    });

    if(req.file){
        let folder = "services";
        const image = await uploadToCloudinary([req.file], folder);
        service.image = image[0].url;
    }

    await service.save();

    // Clean up temporary file after successful upload
    await cleanupAfterUpload(req.file);

    return res.status(201).json({
        message : "Service created successfully",
        service
    })
    
  } catch (error) {
    // Clean up temporary file even if there was an error
    await cleanupAfterUpload(req.file);
    
    res.status(400).json({ error: error.message });
  }
};

// get all
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    return res.status(200).json(
      {
        message: "Services fetched successfully",
        services,
      }
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get by id
export const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    return res.status(200).json({
      message: "Service fetched successfully",
      service,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update by id
export const updateService = async (req, res) => {
  const { id } = req.params;
  const { title, description, features, category } = req.body;

  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }  
    service.title = title || service.title;
    service.description = description || service.description;
    service.features = JSON.parse(features) || service.features;
    service.category = category || service.category;
    if(req.file){
        if(service.image){
            await deleteFromCloudinary(service.image);
        }
        let folder = "services";
        const image = await uploadToCloudinary([req.file], folder);
        service.image = image[0].url;
    }
    await service.save();
    return res.status(200).json({
      message: "Service updated successfully",
      service,
    });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}


//delete by id
export const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    if(service.image){
        await deleteFromCloudinary(service.image);
    }
    await Service.findByIdAndDelete(id);
    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

