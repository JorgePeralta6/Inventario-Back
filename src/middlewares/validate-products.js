import User from '../users/user.model.js';
import Product from '../products/product.model.js';
import Category from '../categories/category.model.js';

export const validateProduct = async (req, res, next) => {
    const authenticatedUser = req.usuario.role;
    if (authenticatedUser !== "ADMIN_ROLE") {
        return res.status(403).json({
            success: false,
            msg: 'You do not have permission to modify products'
        });
    }

    next()

}

export const validateExists = async (req, res, next) => {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
        return res.status(400).json({
            success: false,
            msg: 'Product not found'
        })
    }
    req.product = product;
    next();
}

export const categoryExists = async(req, res, next) => {
    const { categoryId } = req.body;

    if (categoryId) {
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid category ID'
            });
        }
        data.category = categoryId;
    }

    next();
}
