import Product from '../products/product.model.js';

export const validateStock = async (req, res, next) => {

    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
        return res.status(400).json({
            success: false,
            msg: 'Product not found'
        })
    }

    if (product.stock < quantity) {
        return res.status(400).json({
            success: false,
            msg: 'Insufficient stock'
        })
    }
    req.product = product;
    next();

}