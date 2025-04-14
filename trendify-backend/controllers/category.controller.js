import categoryModel from "../models/category.model.js";

export const addCategory = async (req, res) => {
    try {
        const {name} = req.body
        if(!name){
            return res.status(400).json({ 
                success: false, 
                message: "Category name is required." 
            });
        }
        const existingCategory = await categoryModel.findOne({name});
        if (existingCategory) {
            return res.status(400).json({ 
                success: false, 
                message: "Category already exists." 
            });
        }
        const newCategory = new categoryModel({ 
            name
        });
        await newCategory.save();

        return res.status(201).json({
            success: true,
            message: "Category added successfully.",
            category: newCategory
        });
    } catch (error) {
        console.error("Error adding category:", error);
        return res.status(500).json({
            success: false,
            message: "Server error, unable to add category."
        });
    }

};

export const updateCategory = async (req, res) => {
    try {
        const {id} = req.params;
        const {newCategoryName} = req.body;

        if(!categoryId){
            return res.status(400).json({ 
                success: false, 
                message: "Category Id is required." 
            });
        }

        const duplicateCategory = await categoryModel.findOne({ name: newCategoryName });
        if (duplicateCategory && duplicateCategory._id.toString() !== id) {
            return res.status(400).json({
                success: false,
                message: "Category name already exists."
            });
        }


        existingCategory.name = newCategoryName || existingCategory.name;
        await existingCategory.save();
        return res.status(200).json({ 
            success: true, 
            message: "Category updated successfully.",
            category: existingCategory
        });
        
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({
            success: false,
            message: "Server error, unable to update category."
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params; 

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required",
            });
        }

        const category = await categoryModel.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({
            success: false,
            message: "Server error, unable to delete category",
        });
    }
};


export const getCategory = async (req, res) => {

};

export const getListCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find();

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: "No category found." });
        }

        return res.status(200).json({
            success: true,
            message: "Category fetched successfully.",
            categories: categories
        });
    } catch (error) {
        console.error("Error fetching category:", error);
        return res.status(500).json({ message: "Server error" });
    }
};