import express from 'express'
import {addProduct, updateProduct, deleteProduct, getProduct, getListProduct} from '../controllers/product.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.middleware.js'
import roleMiddleware from '../middlewares/role.middleware.js'

const productRouter = express.Router();
productRouter.post('/', authMiddleware, roleMiddleware(['admin']),
upload.fields([
    {name:"image1", maxCount:1},
    {name:"image2", maxCount:1},
    {name:"image3", maxCount:1},
    {name:"image4", maxCount:1},
]), 
addProduct); 
productRouter.put('/:id', authMiddleware, roleMiddleware(['admin']), updateProduct);
productRouter.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteProduct);

productRouter.get('/', authMiddleware, roleMiddleware(['admin', 'user']), getListProduct);
productRouter.get('/:id', getProduct);

export default productRouter;