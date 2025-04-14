import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/product.model.js';
import categoryModel from '../models/category.model.js';

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, sizes, category, subCategory, bestSeller } = req.body;

        // Validate input fields
        if (!name || !description || !price || !sizes || !category || !subCategory) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: name, description, price, sizes, category, subCategory."
            });
        }

        // Check if category exists
        const existingCategory = await categoryModel.findById(category);
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }
        
        // Process images
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        const images = [image1,image2,image3,image4].filter((item)=>item !== undefined)
        
        // Upload images to Cloudinary
        const imageUrl = await Promise.all(
            images.map(async (item) => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "Trendify-Products",
                            resource_type: "image",
                            public_id: `${name}-${item.fieldname}`, 
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    ).end(item.buffer);
                });
            })
        );

        // Create new product
        const newProduct = new productModel({
            name,
            description,
            price: Number(price),
            images: imageUrl, 
            sizes: JSON.parse(sizes),
            category, 
            subCategory,
            bestSeller: bestSeller === 'false' || bestSeller === false,
        });

        await newProduct.save();

        return res.status(201).json({
            success: true,
            message: "Product added successfully!",
            product: newProduct,
        });

    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({
            success: false,
            message: "Server error, unable to add product."
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            description, 
            price, 
            sizes, 
            category, 
            subCategory, 
            bestSeller 
        } = req.body;

        // Validate product ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        // Find existing product
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Optional validation for category
        if (category) {
            const existingCategory = await categoryModel.findById(category);
            if (!existingCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found.",
                });
            }
        }

        // Process image updates
        let imageUrl = existingProduct.images;
        if (req.files && Object.keys(req.files).length > 0) {
            // Delete existing Cloudinary images if they exist
            if (existingProduct.images && existingProduct.images.length > 0) {
                await Promise.all(
                    existingProduct.images.map(async (imageUrl) => {
                        const publicId = imageUrl.split('/').pop().split('.')[0];
                        await cloudinary.uploader.destroy(`Trendify-Products/${publicId}`);
                    })
                );
            }

            // Upload new images
            const image1 = req.files.image1 && req.files.image1[0]
            const image2 = req.files.image2 && req.files.image2[0]
            const image3 = req.files.image3 && req.files.image3[0]
            const image4 = req.files.image4 && req.files.image4[0]
            const images = [image1,image2,image3,image4].filter((item)=>item !== undefined)
            
            imageUrl = await Promise.all(
                images.map(async (item) => {
                    return new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream(
                            {
                                folder: "Trendify-Products",
                                resource_type: "image",
                                public_id: `${name || existingProduct.name}-${item.fieldname}`, 
                            },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result.secure_url);
                            }
                        ).end(item.buffer);
                    });
                })
            );
        }

        // Update product fields
        existingProduct.name = name || existingProduct.name;
        existingProduct.description = description || existingProduct.description;
        existingProduct.price = price ? Number(price) : existingProduct.price;
        existingProduct.sizes = sizes ? JSON.parse(sizes) : existingProduct.sizes;
        existingProduct.category = category || existingProduct.category;
        existingProduct.subCategory = subCategory || existingProduct.subCategory;
        existingProduct.bestSeller = bestSeller !== undefined 
            ? (bestSeller === 'true' || bestSeller === true) 
            : existingProduct.bestSeller;
        existingProduct.images = imageUrl;

        // Save updated product
        await existingProduct.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            product: existingProduct,
        });

    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            success: false,
            message: "Server error, unable to update product.",
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        // Find product to delete
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            await Promise.all(
                product.images.map(async (imageUrl) => {
                    const publicId = imageUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`Trendify-Products/${publicId}`);
                })
            );
        }

        // Delete product from database
        await productModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            success: false,
            message: "Server error, unable to delete product.",
        });
    }
}

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params; 

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        // Populate category details
        const product = await productModel.findById(id).populate('category');
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product retrieved successfully!",
            product: product,
        });
    } catch (error) {
        console.error("Error retrieving product:", error);
        return res.status(500).json({
            success: false,
            message: "Server error, unable to retrieve product.",
        });
    }
}

export const getListProduct = async (req, res) => {
    try {
        // Add query parameters for filtering and pagination
        const { 
            page = 1, 
            limit = 10, 
            category, 
            subCategory, 
            sortByPrice,
            bestSeller 
        } = req.query;

        // Build query object
        const query = {};
        if (category) query.category = category;
        if (subCategory) query.subCategory = subCategory;
        if (bestSeller !== undefined) {
            query.bestSeller = bestSeller === 'true' || bestSeller === true;
        }

        // Pagination
        const options = {
            page: Number(page),
            limit: Number(limit),
            populate: 'category',
            sort: sortByPrice 
                ? { price: sortByPrice === 'asc' ? 1 : -1 }
                : { createdAt: -1 }
        };

        // Fetch paginated products
        const products = await productModel.paginate(query, options);

        if (!products || products.docs.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "No products found." 
            });
        }
        const nextPage = products.page < products.totalPages ? products.page + 1 : null;
        return res.status(200).json({
            success: true,
            message: "Products retrieved successfully!",
            products: products.docs,
            totalProducts: products.totalDocs,
            totalPages: products.totalPages,
            currentPage: products.page,
            nextPage: nextPage

        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
}