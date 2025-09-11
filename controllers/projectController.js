import { Project, Category } from "../models/projectModel.js";
import {deleteFromCloudinary,uploadToCloudinary} from "../config/cloudinaryService.js"
import { cleanupAfterUpload } from "../utils/cleanupTempFiles.js";
// create
export const createProject = async (req, res) => {
    try{
        const {title, description, categoryId, location, technologies, status = "ongoing"  } = req.body;

        if(!title || !description || !categoryId){
            return res.status(400).json({message: "Please fill all the fields"});
        }
        const parsedTechnologies = technologies ? JSON.parse(technologies) : [];
        const newProject = new Project({
            title,
            description,
            category: categoryId,
            location,
            technologies: parsedTechnologies,
            status,
        });

        if (req.files.file) {
          let folder = "Projects";
          let file = req.files.file;
          const url = await uploadToCloudinary(file, folder);
          newProject.image = url[0].url;
        }

        // Handle portfolio images upload
        if(req.files && req.files.portfolioImages){
            let folder = "Projects/portfolios";
            const portfolioUrls = await uploadToCloudinary(req.files.portfolioImages, folder);
            newProject.portfolioImages = portfolioUrls.map(img => img.url);
        }
        const savedProject = await newProject.save();

        // Clean up temporary file after successful upload
        await cleanupAfterUpload(req.file);

        res.status(201).json({message: "Project created successfully", project: savedProject});
    }
    catch(err){
        // Clean up temporary file even if there was an error
        await cleanupAfterUpload(req.file);
        
        res.status(500).json({message: err.message});
    }
}

// get all projects 
export const getAllProjects = async (req, res) => {
    try{
        const projects = await Project.find();
        res.status(200).json({projects});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

// get project by id
export const getProjectById = async (req, res) => {
    try{
        const project = await Project.findById(req.params.id);
        if(!project){
            return res.status(404).json({message: "Project not found"});
        }
        res.status(200).json({project});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

// update project
export const updateProject = async (req, res) => {
    try{
        const {title, description, location, technologies, status = "ongoing"  } = req.body;

        const project = await Project.findById(req.params.id);
        if(!project){
            return res.status(404).json({message: "Project not found"});
        }

        if(req.file){
            if(project.image){
                await deleteFromCloudinary([project.image]);
            }
            let folder = "Projects"
            let file = req.file;
            const url = await uploadToCloudinary([file], folder);
            project.image = url[0].url;
        }

        // Handle portfolio images upload
        if(req.files && req.files.portfolioImages){
            let folder = "Projects/portfolios";
            const portfolioUrls = await uploadToCloudinary(req.files.portfolioImages, folder);
            const newPortfolioUrls = portfolioUrls.map(img => img.url);
            
            // Merge with existing portfolio images if provided
            let existingPortfolioUrls = [];
            if (req.body.existingPortfolioImages) {
                try {
                    existingPortfolioUrls = JSON.parse(req.body.existingPortfolioImages);
                } catch (e) {
                    console.log("Error parsing existingPortfolioImages:", e);
                }
            }
            
            project.portfolioImages = [...existingPortfolioUrls, ...newPortfolioUrls];
        }

        project.title = title;
        project.description = description;
        project.location = location;
        project.technologies = JSON.parse(technologies);
        project.status = status;

        const updatedProject = await project.save();

        // Clean up temporary file after successful upload
        await cleanupAfterUpload(req.file);

        res.status(200).json({message: "Project updated successfully", project: updatedProject});
    }
    catch(err){
        // Clean up temporary file even if there was an error
        await cleanupAfterUpload(req.file);
        
        res.status(500).json({message: err.message});
    }
}

// delete project
export const deleteProject = async (req, res) => {
    try{
        const project = await Project.findById(req.params.id);
        if(!project){
            return res.status(404).json({message: "Project not found"});
        }
        if(project.image){
            await deleteFromCloudinary(project.image);
        }
        // Delete portfolio images
        if(project.portfolioImages && project.portfolioImages.length > 0){
            await deleteFromCloudinary(project.portfolioImages);
        }
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Project deleted successfully"});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

// get projects by category
export const getProjectsByCategory = async (req, res) => {
    try{
        const projects = await Project.find({category: req.params.categoryId});
        res.status(200).json({projects});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

// Note: Category management can be added similarly 
//create category 
export const createCategory = async (req, res) => {
    try{
        const {name} = req.body;
        const category = new Category({name});
        if(req.file){
            let folder = "Categories";
            let file = req.file;
            const url = await uploadToCloudinary([file], folder);
            category.image = url[0].url;
        }
        await category.save();
        res.status(201).json({message: "Category created successfully", category});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

// get all categories
export const getAllCategories = async (req, res) => {
    try{
        const categories = await Category.find();
        res.status(200).json({categories});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

// delete category
export const deleteCategory = async (req, res) => {
    try{
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message: "Category not found"});
        }
        if(category.projects && category.projects.length > 0){
            return res.status(400).json({message: "Cannot delete category with associated projects"});
        }
        if(category.image){
            await deleteFromCloudinary(category.image);
        }
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Category deleted successfully"});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

// update category
export const updateCategory = async (req, res) => {
    try{
        const {name} = req.body;
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message: "Category not found"});
        }
        category.name = name;
        if(req.file){
            if(category.image){
                await deleteFromCloudinary([category.image]);
            }
            let folder = "Categories";
            let file = req.file;
            const url = await uploadToCloudinary([file], folder);
            category.image = url[0].url;
        }
        await category.save();
        res.status(200).json({message: "Category updated successfully", category});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

//get category by id
export const getCategoryById = async (req, res) => {
    try{
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message: "Category not found"});
        }
        res.status(200).json({category});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
