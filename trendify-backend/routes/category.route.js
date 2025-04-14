import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import {addCategory, updateCategory, deleteCategory, getCategory, getListCategory} from '../controllers/category.controller.js'

const categoryRouter = express.Router();
categoryRouter.post('/', authMiddleware, addCategory); 
categoryRouter.put('/:id', authMiddleware, updateCategory);
categoryRouter.delete('/:id', authMiddleware, deleteCategory);

categoryRouter.get('/:id', getCategory);
categoryRouter.get('/', getListCategory);

export default categoryRouter;